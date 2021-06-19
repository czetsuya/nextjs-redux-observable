import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {request} from 'universal-rxjs-ajax';
import {actionStates} from '../ModuleUtil';

// CONSTANTS - START
const INITIAL_STATE = {
  error: null,
  status: {inserted: false, updated: false, deleted: false},
};
// CONSTANTS -END

// ACTION TYPES - START
const RETRIEVE_LIST = actionStates('actions/RETRIEVE_LIST');
// ACTION TYPES - END

// REDUCER - START
export const reducer = (state = INITIAL_STATE, {type, payload}) => {
  switch (type) {
    case RETRIEVE_LIST.SUCCESS:
      return {
        ...state,
        [payload.type]: {
          list: payload.list,
          count: payload.count
        }
      };
    case RETRIEVE_LIST.ERROR:
      return {
        ...state,
        error: payload.error,
      };
    default:
      return state;
  }
};
// REDUCER - END

// ACTIONS - START
export const retrieveList = ({type, offset, limit}) => ({
  type: RETRIEVE_LIST.START,
  payload: {type, offset, limit},
});
export const retrieveListSuccess = ({type, list, count}) => ({
  type: RETRIEVE_LIST.SUCCESS,
  payload: {type, list, count},
});
export const retrieveListError = ({status, name, message}) => ({
  type: RETRIEVE_LIST.ERROR,
  payload: {status, name, message},
});
// ACTIONS - END

// EPICS - START
const retrieveListEpic = (action$, state$) =>
    action$.pipe(
        ofType(RETRIEVE_LIST.START),
        mergeMap((action) => {
          const {type, limit, offset} = action.payload;
          return request({
            url: `http://localhost:3000/api/${type}/?limit=${limit}&offset=${offset}`,
          }).pipe(
              map((response) => retrieveListSuccess(
                  {type, list: response.response[type], count: response.response.count})),
              catchError((error) => {
                const {status, name, message} = error;
                return of(retrieveListError({status, name, message}));
              }),
          );
        }),
    );
// EPICS - END

export const epics = [
  retrieveListEpic,
];