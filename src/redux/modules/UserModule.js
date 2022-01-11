import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {request} from 'universal-rxjs-ajax';
import {actionStates} from '../ModuleUtil';
import * as ajax from '../../utils/ajax';
import {ajaxGet, ajaxPost} from '../../utils/ajax';

// CONSTANTS - START
const INITIAL_STATE = {
  error: null,
  status: {inserted: false, updated: false, deleted: false},
};
// CONSTANTS - END

// ACTION TYPES - START
const RETRIEVE_LIST = actionStates('actions/USER_RETRIEVE_LIST');
const CREATE_USER = actionStates('actions/CREATE_USER');
const REDIRECT_TO_LIST_PAGE = actionStates('actions/REDIRECT_TO_LIST_PAGE');
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
        ...state,
        user: payload.user,
        status: {...state.status, saved: true},
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
export const retrieveListSuccess = ({list, count}) => ({
  type: RETRIEVE_LIST.SUCCESS,
  payload: {list, count},
});
export const retrieveListError = ({status, name, message}) => ({
  type: RETRIEVE_LIST.ERROR,
  payload: {status, name, message},
});

export const createUser = (user, router) => ({
  type: CREATE_USER.START,
  payload: {user, router}
});
export const createUserOk = (router) => ({
  type: CREATE_USER.SUCCESS,
  payload: {router}
});
export const createUserKo = ({status, name, message}) => ({
  type: CREATE_USER.ERROR,
  payload: {status, name, message},
});
export const redirectToListPageSuccess = () => ({
  type: REDIRECT_TO_LIST_PAGE.SUCCESS,
});
// ACTIONS - END

// EPICS - START
const retrieveListEpic = (action$, state$) =>
    action$.pipe(
        ofType(RETRIEVE_LIST.START),
        mergeMap((action) => {
          const {limit, offset} = action.payload;
          return ajaxGet({
            url: `api/users?limit=${limit}&offset=${offset}`
          }).pipe(
              map((resp) => retrieveListSuccess(
                  {list: resp.response.users, count: resp.response.count})),
              catchError((err) => {
                const {status, name, message} = err;
                return of(createUserKo({status, name, message}));
              }),
          );
        }),
    );

const createUserEpic = (action$, state$) =>
    action$.pipe(
        ofType(CREATE_USER.START),
        mergeMap(action => {
          const {user, router} = action.payload;
          const newUser = Object.keys(user).reduce((userValues, key) => {
            const value = user[key];
            return !value ? userValues : {...userValues, [key]: value};
          }, {});
          console.log("posting new user", newUser);
          return ajaxPost({
            url: `api/users`,
            method: 'POST',
            headers: ajax.getHeaders(),
            body: {
              ...newUser
            }
          }).pipe(
              map(resp => createUserOk(router)),
              catchError(err => {
                const {status, name, message} = err;
                return of(createUserKo({status, name, message}));
              })
          );
        })
    );

const createUserOkEpic = (action$, state$) =>
    action$.pipe(
        ofType(CREATE_USER.SUCCESS),
        map(action => {
          const {router} = action.payload;
          console.log("create user ok", router)
          router.push("/users");
          return redirectToListPageSuccess();
        })
    );
// EPICS - END

export const epics = [
  retrieveListEpic, createUserEpic, createUserOkEpic
];