import {epics as userEpics, reducer as user} from './modules/UserModule.js';

export const reducers = {
  user
};

export const epics = [...userEpics];