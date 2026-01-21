# vtools

一个功能强大的Vue 3工具集应用，提供多种实用工具，帮助开发者提高工作效率。

## 功能模块

### 检测工具 (Detect)

- **Axios请求**: 模拟和测试Axios请求
- **浏览器信息**: 查看当前浏览器详细信息
- **网络视图**: 网络请求分析和监控

### 开发工具 (Development)

- **Crontab生成器**: 可视化生成和验证Crontab表达式
- **时间戳转换**: 时间戳与日期时间互转，实时钟表显示

### 加密工具 (Encryption)

- **加密工具**: 各种加密算法实现和测试
- **JWT工具**: JWT令牌生成和解析
- **密钥对生成器**: 生成和管理密钥对

### 图片工具 (Image)

- **Favicon生成器**: 生成网站图标
- **二维码生成器**: 生成各种二维码
- **二维码扫描器**: 扫描和解析二维码

### JSON工具 (JSON)

- **数据伪造器**: 使用faker生成测试数据
- **格式化工具**: JSON、XML等数据格式化
- **表格视图**: 数据表格化展示
- **YAML转换**: YAML与其他格式互转

### 字符串工具 (Strings)

- **转换器**: 各种单位和格式转换
- **差异比较**: 文本差异对比
- **随机生成器**: 生成随机字符串、数字等

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **日期处理**: dayjs
- **网络请求**: Axios
- **代码质量**: ESLint + Prettier

## 系统要求

- Node.js: ^20.19.0 || >=22.12.0

## 项目设置

### 安装依赖

```bash
# 使用 pnpm
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发模式运行

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

### 预览生产构建

```bash
pnpm run preview
```

### 代码质量检查

```bash
# 格式化代码
pnpm run format

#  lint检查
pnpm run lint

# 类型检查
pnpm run type-check

# 综合检查（格式化 + lint + 类型检查 + 构建）
pnpm run check
```

## 推荐IDE设置

- **VS Code**: [下载](https://code.visualstudio.com/)
- **插件**: 
  - [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用Vetur)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 推荐浏览器设置

- **基于Chromium的浏览器** (Chrome, Edge, Brave等):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - 开启Chrome DevTools中的自定义对象格式化器

- **Firefox**:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - 开启Firefox DevTools中的自定义对象格式化器

## 项目结构

```bash
src/
├── assets/          # 静态资源
├── components/      # 通用组件
├── composables/     # 组合式函数
├── layouts/         # 布局组件
├── router/          # 路由配置
├── types/           # 类型定义
├── views/           # 页面视图
│   ├── detect/      # 检测工具
│   ├── development/ # 开发工具
│   ├── encryption/  # 加密工具
│   ├── image/       # 图片工具
│   ├── json/        # JSON工具
│   ├── strings/     # 字符串工具
│   └── HomeView.vue # 首页
├── App.vue          # 根组件
└── main.ts          # 入口文件
```

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！
