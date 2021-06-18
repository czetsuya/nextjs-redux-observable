export const actionStates = (name) => ({
  START: name + '_START',
  LOADING: name + '_LOADING',
  SUCCESS: name + '_SUCCESS',
  ERROR: name + '_ERROR',
  FATAL: name + '_FATAL',
  INVOKED: name + '_INVOKED',
  STOP: name + '_STOP',
  COMPLETED: name + '_COMPLETED',
});
