import {epics as genericEntityEpics, reducer as genericEntity} from './modules/GenericEntityModule.js';

export const reducers = {
  genericEntity
};

export const epics = [...genericEntityEpics];