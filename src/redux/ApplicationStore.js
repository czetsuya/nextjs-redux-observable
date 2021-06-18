import {useMemo} from 'react';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {combineEpics, createEpicMiddleware} from 'redux-observable';
import {composeWithDevTools} from 'redux-devtools-extension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistCombineReducers, persistStore} from 'redux-persist';
import {epics, reducers} from './Modules.js';
import packageInfo from '../../package.json';

let store;

const isClient = typeof window !== 'undefined';

const isProductionMode =
    process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production';

const epicMiddleware = createEpicMiddleware();
const reduxMiddleware = applyMiddleware(epicMiddleware);
const middleware = isProductionMode
    ? compose(reduxMiddleware)
    : composeWithDevTools(reduxMiddleware);

const initStore = (initialState) => {
  const _store = isClient
      ? createStore(
          persistCombineReducers(
              {
                key: `${packageInfo.name}-v${packageInfo.version}`,
                storage: AsyncStorage,
              },
              reducers,
          ),
          initialState,
          middleware,
      )
      : createStore(combineReducers(reducers), initialState, middleware);
  const persistor = isClient ? persistStore(_store) : null;
  epicMiddleware.run(combineEpics(...epics));
  return {store: _store, persistor};
};

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    _store = undefined;
  }

  // For SSG and SSR always create a new store
  if (!isClient) {
    return _store;
  }
  // Create the store once in the client
  if (!store) {
    store = _store;
  }

  return _store;
};

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState]);
}
