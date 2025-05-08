import currentDispatcher, { Dispatcher, resolveDispatcher } from "./src/currentDispatcher";


export const useState: Dispatcher['useState'] = (initialState) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
};

// 内部数据共享层
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  currentDispatcher
};

// 为了将 react-reconciler 和 react 解耦，在 shared 中转，方便 react-reconciler 使用
export const internals = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

