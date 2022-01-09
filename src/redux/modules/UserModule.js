import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {request} from 'universal-rxjs-ajax';
import {actionStates} from '../ModuleUtil';
import * as ajax from '../../utils/ajax';

// CONSTANTS - START
const INITIAL_STATE = {
  error: null,
  status: {inserted: false, updated: false, deleted: false},
};
// CONSTANTS - END

// ACTION TYPES - START
const RETRIEVE_LIST = actionStates('actions/USER_RETRIEVE_LIST');
const CREATE_USER = actionStates('actions/CREATE_USER');
// ACTION TYPES - END

// REDUCER - START
export const reducer = (state = INITIAL_STATE, {type, payload}) => {
  switch (type) {
    case RETRIEVE_LIST.SUCCESS:
      return {
        ...state,
        list: payload.list,
        count: payload.count
      };
    case CREATE_USER.SUCCESS:
      return {
        ...state
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
export const retrieveList = ({offset, limit}) => ({
  type: RETRIEVE_LIST.START,
  payload: {offset, limit},
});
export const retrieveListSuccess = ({type, list, count}) => ({
  type: RETRIEVE_LIST.SUCCESS,
  payload: {list, count},
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
          const {limit, offset} = action.payload;
          return request({
            url: `http://localhost:3000/api/${type}/?limit=${limit}&offset=${offset}`,
            method: 'GET',
            headers: ajax.getHeaders()
          }).pipe(
              map((response) => retrieveListSuccess(
                  {list: response.response[type], count: response.response.count})),
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