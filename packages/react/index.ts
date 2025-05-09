import { jsx, Fragment } from "./src/jsx";
import currentDispatcher, { Dispatcher, resolveDispatcher } from "./src/currentDispatcher";
import {
  type ReactElementType
} from 'shared'


export {
  Fragment
}
export {
  ReactElementType
}

export default {
  version: "1.0.0",
  createElement: jsx,
};


export const useState: Dispatcher['useState'] = (initialState) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
};

export const useEffect: Dispatcher['useEffect'] = (creact, deps) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(creact, deps);
};


// 内部数据共享层
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  currentDispatcher
};

// 为了将 react-reconciler 和 react 解耦，在 shared 中转，方便 react-reconciler 使用
export const internals = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

