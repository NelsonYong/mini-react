import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'mini-react',
  description: '渐进式学习 React 核心原理及实现',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '源码解析', link: '/source/' },
      { text: '示例', link: '/demo/' }
    ],
    sidebar: {
      '/source/': [
        {
          text: '源码解析',
          items: [
            { text: 'react', link: '/source/react' },
            { text: 'react-dom', link: '/source/react-dom' },
            { text: 'react-reconciler', link: '/source/react-reconciler' },
            { text: 'shared', link: '/source/shared' }
          ]
        }
      ],
      '/demo/': [
        {
          text: '示例',
          items: [
            { text: 'react-jsx-demo', link: '/demo/react-jsx-demo' }
          ]
        }
      ]
    }
  }
}) 