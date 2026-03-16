# LMArena Navigator

一个面向 Arena / LMArena 页面侧边栏增强的 Chrome 扩展。

当前实现基于 Manifest V3 和原生 JavaScript，无构建步骤，直接以 Content Script 的方式注入页面，为 Arena 对话页补充左侧文件夹管理、右侧目录导航与提示词库等能力。

## 参考项目

本项目的部分交互设计与侧边栏增强思路参考了 [gemini-voyager](https://github.com/Nagi-ovo/gemini-voyager)。

## 功能概览

- 左侧文件夹管理
- 会话拖拽归类
- 原生历史记录共享滚动区域
- 文件夹置顶、重命名、颜色、子文件夹、删除
- 右侧目录导航
- 用户消息与 AI 标题分组折叠
- Scrollspy 滚动跟随与平滑跳转
- 右侧提示词库
- 提示词本地增删改查与一键插入输入框
- 全局悬浮 Tooltip
- 侧边栏折叠 / 唤醒
- 全中文界面

## 支持站点

`manifest.json` 当前匹配以下站点：

- `https://arena.ai/*`
- `https://*.arena.ai/*`
- `https://lmarena.ai/*`
- `https://*.lmarena.ai/*`
- `https://chat.lmsys.org/*`

## 项目结构

```text
.
├─ manifest.json        # Chrome 扩展配置
├─ content.js           # 主逻辑与 DOM 注入
├─ style.css            # 全局样式
├─ modules/
│  ├─ core.js           # 通用工具函数
│  ├─ storage.js        # chrome.storage 封装
│  └─ lmarena.js        # Arena 站点适配逻辑
└─ AGENTS.md            # 代理开发约束
```

## 安装方式

1. 打开 Chrome 或 Edge。
2. 进入 `chrome://extensions/`。
3. 打开右上角“开发者模式”。
4. 点击“加载已解压的扩展程序”。
5. 选择项目根目录：`C:\Users\Administrator\Desktop\lmarena-navigator`。

## 开发说明

- 本项目没有构建步骤，也没有打包流程。
- 修改源码后，在扩展管理页点击“刷新”即可重新加载。
- 页面侧验证方式：
  - 刷新目标站点页面
  - 检查左侧文件夹模块是否注入成功
  - 检查右侧目录 / 提示词库是否正常
  - 检查控制台是否有报错

## 存储说明

扩展当前使用 `chrome.storage.local` 持久化以下数据：

- 文件夹树
- 文件夹折叠状态
- 会话归类关系
- 提示词库
- 主题与面板状态

## 技术栈

- Chrome Extension Manifest V3
- Vanilla JavaScript
- Content Scripts
- 原生 DOM API
- 原生 HTML5 Drag and Drop
- `chrome.storage.local`

## 维护原则

- 使用 IIFE 封装，避免污染全局作用域
- 以 Arena 实际 DOM 为准，避免写死脆弱结构
- 优先保证注入稳定性、滚动体验和宿主页面融合度

## 调试建议

- 重点查看浏览器控制台中的脚本报错
- Arena 页面 DOM 变动时，优先检查选择器和注入锚点
- 修改 `content.js` 或 `style.css` 后，记得同时刷新扩展和页面
