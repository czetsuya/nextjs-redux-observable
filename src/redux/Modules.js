import { reducer as user, epics as userEpics } from './modules/UserModule.js';

export const reducers = {
  user,
};

export const epics = [...userEpics];
