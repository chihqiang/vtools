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

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { id, type, payload } = e.data

  if (type === 'parse') {
    try {
      const result = JSON.parse(payload)
      const response: WorkerResponse = { id, type, result }
      self.postMessage(response)
    } catch (err) {
      const response: WorkerResponse = {
        id,
        type,
        result: null,
        error: err instanceof Error ? err.message : 'Unknown error',
      }
      self.postMessage(response)
    }
  }
}
