interface WorkerRequest {
  id: number
  type: 'parse'
  payload: string
}

interface WorkerResponse {
  id: number
  type: 'parse'
  result: unknown
  error?: string
}

const PARSE_THRESHOLD = 512 * 1024

let worker: Worker | null = null
let nextId = 0
const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>()

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('@/workers/json.worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const { id, result, error } = e.data
      const p = pending.get(id)
      if (!p) return
      pending.delete(id)
      if (error) p.reject(new Error(error))
      else p.resolve(result)
    }
    worker.onerror = (e) => {
      console.error('JSON worker error:', e)
    }
  }
  return worker
}

export function useJsonWorker() {
  function parseJSON(jsonString: string): Promise<unknown> {
    // 小 JSON 直接主线程解析，避免 worker 通信开销
    if (jsonString.length < PARSE_THRESHOLD) {
      try {
        return Promise.resolve(JSON.parse(jsonString))
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return new Promise((resolve, reject) => {
      const id = nextId++
      pending.set(id, { resolve, reject })
      const request: WorkerRequest = { id, type: 'parse', payload: jsonString }
      getWorker().postMessage(request)
    })
  }

  function terminate() {
    if (worker) {
      worker.terminate()
      worker = null
    }
    pending.clear()
  }

  return { parseJSON, terminate }
}
