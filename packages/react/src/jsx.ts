/* eslint-disable @typescript-eslint/no-explicit-any */
import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from 'shared/ReactSymbols';
import {
  Type,
  Ref,
  Key,
  Props,
  ReactElementType,
  ElementType
} from 'shared/ReactTypes';



//  react 官方的 jsx 方法
// import { jsx as _jsx } from 'react/jsx-runtime';
// function App() {
//   return _jsx('div', { children: 'Hello world!' });
// }

const ReactElement = function (
  type: Type,
  key: Key,
  ref: Ref,
  props: Props
): ReactElementType {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __author: 'NelsonYong',
    __github: 'https://github.com/NelsonYong'
  };
  return element;
};

export const Fragment = REACT_FRAGMENT_TYPE;


export const jsx = (type: ElementType, config: any, ...children: any) => {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};
  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (val !== undefined) {
        // 之所以使用 '' + val 是为了避免 val 为数字时，被转换成 boolean 值 
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    // 是为了避免原型链上的属性被继承，只继承自身的属性
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }
  const childrenLength = children.length;
  if (childrenLength) {
    if (childrenLength === 1) {
      props.children = children[0];
    } else {
      props.children = children;
    }
  }
  return ReactElement(type, key, ref, props);
}

// 为了区分生产环境和开发环境，这里再定义一个 jsxDEV 方法，唯一的区别是，开发环境不处理 children 参数，方便多做一些额外的检查
export const jsxDEV = (type: ElementType, config: any) => {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};
  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }
  return ReactElement(type, key, ref, props);
};

