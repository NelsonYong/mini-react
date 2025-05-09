# react-dom 源码解析

## 模块简介

`react-dom` 包负责将虚拟 DOM 渲染到真实 DOM，处理事件系统等。

## 主要文件
- `index.ts`、`client.ts`：导出渲染相关 API。
- `src/hostConfig.ts`：平台相关的 DOM 操作实现。
- `src/SyntheticEvent.ts`：合成事件系统实现。
- `src/root.ts`：根节点管理。

## 实现思路
- 通过 `render` 方法将虚拟 DOM 渲染为真实 DOM。
- 实现合成事件系统，统一事件处理。
- 结合 reconciler 协调更新。

> 详细源码请参考各文件注释。 