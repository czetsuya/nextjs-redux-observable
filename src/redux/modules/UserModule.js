import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {request} from 'universal-rxjs-ajax';
import {actionStates} from '../ModuleUtil';

// CONSTANTS - START
const INITIAL_STATE = {
  users: [],
  count: 0,
  error: null,
  user: null,
  status: {saved: false, updated: false, deleted: false},
};
// CONSTANTS -END

// ACTION TYPES - START
const RETRIEVE_USER_LIST = actionStates('users/RETRIEVE_USER_LIST');
const CREATE_USER = actionStates('users/CREATE_USER');
const RETRIEVE_USER = actionStates('users/RETRIEVE_USER');
const UPDATE_USER = actionStates('users/UPDATE_USER');
const DELETE_USER = actionStates('users/DELETE_USER');
const REDIRECT_TO_UPDATE_PAGE = actionStates('users/REDIRECT_TO_UPDATE_PAGE');
const CLEAR_STATUS = 'users/CLEAR_STATUS';
const CLEAR_USER = 'users/CLEAR_USER';
// ACTION TYPES - END

// REDUCER - START
export const reducer = (state = INITIAL_STATE, {type, payload}) => {
  switch (type) {
    case CREATE_USER.SUCCESS:
      return {
        ...state,
        user: payload.user,
        status: {...state.status, saved: true},
      };
    case UPDATE_USER.SUCCESS:
      return {
        ...state,
        user: payload.user,
        status: {...state.status, updated: true},
      };
    case DELETE_USER.SUCCESS:
      return {
        ...state,
        user: payload.user,
        status: {...state.status, deleted: true},
      };
    case RETRIEVE_USER_LIST.SUCCESS:
      return {
        ...state,
        users: payload.users,
        count: payload.count,
      };
    case RETRIEVE_USER.SUCCESS:
      return {
        ...state,
        user: payload.user,
      };
    case CREATE_USER.ERROR:
    case RETRIEVE_USER.ERROR:
    case RETRIEVE_USER_LIST.ERROR:
      return {
        ...state,
        error: payload.error,
      };
    case CLEAR_STATUS:
      return {
        ...state,
        status: {...INITIAL_STATE.status},
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};
// REDUCER - END

// ACTIONS - START
export const retrieveUserList = ({offset, limit}) => ({
  type: RETRIEVE_USER_LIST.START,
  payload: {offset, limit},
});
export const retrieveUserListSuccess = ({users, count}) => ({
  type: RETRIEVE_USER_LIST.SUCCESS,
  payload: {users, count},
});
export const retrieveUserListError = ({status, name, message}) => ({
  type: RETRIEVE_USER_LIST.ERROR,
  payload: {status, name, message},
});
export const retrieveUser = (id) => ({
  type: RETRIEVE_USER.START,
  payload: {id},
});
export const retrieveUserSuccess = (user) => ({
  type: RETRIEVE_USER.SUCCESS,
  payload: {user},
});
export const retrieveUserError = ({status, name, message}) => ({
  type: RETRIEVE_USER.ERROR,
  payload: {status, name, message},
});
export const createUser = (user, router) => ({
  type: CREATE_USER.START,
  payload: {user, router},
});
export const createUserSuccess = (user, router) => ({
  type: CREATE_USER.SUCCESS,
  payload: {user, router},
});
export const createUserError = ({status, name, message}) => ({
  type: CREATE_USER.ERROR,
  payload: {status, name, message},
});
export const updateUser = (user) => ({
  type: UPDATE_USER.START,
  payload: {user},
});
export const updateUserSuccess = (user) => ({
  type: UPDATE_USER.SUCCESS,
  payload: {user},
});
export const updateUserError = ({status, name, message}) => ({
  type: UPDATE_USER.ERROR,
  payload: {status, name, message},
});
export const deleteUser = ({id}) => ({
  type: DELETE_USER.START,
  payload: {id},
});
export const deleteUserSuccess = (user) => ({
  type: DELETE_USER.SUCCESS,
  payload: {user},
});
export const deleteUserError = ({status, name, message}) => ({
  type: DELETE_USER.ERROR,
  payload: {status, name, message},
});
export const redirectToUpdatePage = (user, router) => ({
  type: REDIRECT_TO_UPDATE_PAGE.START,
  payload: {user, router},
});
export const redirectToUpdatePageSuccess = () => ({
  type: REDIRECT_TO_UPDATE_PAGE.SUCCESS,
});
export const redirectToUpdatePageError = ({status, name, message}) => ({
  type: REDIRECT_TO_UPDATE_PAGE.ERROR,
  payload: {status, name, message},
});
export const clearUserStatus = () => ({
  type: CLEAR_STATUS,
});
export const clearUser = () => ({
  type: CLEAR_USER,
});
// ACTIONS - END

// EPICS - START
const retrieveUsersListEpic = (action$, state$) =>
    action$.pipe(
        ofType(RETRIEVE_USER_LIST.START),
        mergeMap((action) => {
          const {limit, offset} = action.payload;
          return request({
            url: `http://localhost:3000/api/users?limit=${limit}&offset=${offset}`,
          }).pipe(
              map((response) => retrieveUserListSuccess(response.response)),
              catchError((error) => {
                const {status, name, message} = error;
                return of(retrieveUserListError({status, name, message}));
              }),
          );
        }),
    );

const retrieveUserEpic = (action$, state$) =>
    action$.pipe(
        ofType(RETRIEVE_USER.START),
        mergeMap((action) => {
          const {id} = action.payload;
          return request({
            url: `http://localhost:3000/api/users/${id}`,
          }).pipe(
              map((response) => retrieveUserSuccess(response.response)),
              catchError((error) => {
                const {status, name, message} = error;
                return of(retrieveUserListError({status, name, message}));
              }),
          );
        }),
    );

const createUserEpic = (action$, state$) =>
    action$.pipe(
        ofType(CREATE_USER.START),
        mergeMap((action) => {
          const {user, router} = action.payload;
          if (!!user.birthDate) {
            user.birthDate = user.birthDate.toISOString();
          }
          const newUser = Object.keys(user).reduce((userValues, key) => {
            const value = user[key];
            return !value ? userValues : {...userValues, [key]: value};
          }, {});
          return request({
            url: 'http://localhost:3000/api/users',
            method: 'POST',
            body: {...newUser},
          }).pipe(
              map((response) => createUserSuccess(response.response, router)),
              catchError((error) => {
                const {status, name, message} = error;
                return of(createUserError({status, name, message}));
              }),
          );
        }),
    );

const createUserSuccessEpic = (action$, state$) =>
    action$.pipe(
        ofType(CREATE_USER.SUCCESS),
        mergeMap((action) => {
          const {user, router} = action.payload;
          return of(redirectToUpdatePage(user, router));
        }),
        catchError((error) => {
          const {status, name, message} = error;
          return of(createUserError({status, name, message}));
        }),
    );

const updateUserEpic = (action$, state$) =>
    action$.pipe(
        ofType(UPDATE_USER.START),
        mergeMap((action) => {
          const {user} = action.payload;
          if (!!user.birthDate) {
            user.birthDate = user.birthDate.toISOString();
          }
          const {id, ...values} = user;
          const updatedUser = Object.keys(values).reduce((userValues, key) => {
            const value = values[key];
            return !value ? userValues : {...userValues, [key]: value};
          }, {});
          return request({
            url: `http://localhost:3000/api/users/${id}`,
            method: 'PATCH',
            body: {...updatedUser},
          }).pipe(
              map((response) => updateUserSuccess(response.response)),
              catchError((error) => {
                const {status, name, message} = error;
                return of(createUserError({status, name, message}));
              }),
          );
        }),
    );

const deleteUserEpic = (action$, state$) =>
    action$.pipe(
        ofType(DELETE_USER.START),
        mergeMap((action) => {
          const {id} = action.payload;
          return request({
            url: `http://localhost:3000/api/users/${id}`,
            method: 'DELETE',
          }).pipe(
              map((response) => deleteUserSuccess(response.response)),
              catchError((error) => {
                const {status, name, message} = error;
                return of(deleteUserError({status, name, message}));
              }),
          );
        }),
    );

const redirectToUpdatePageEpic = (action$, state$) =>
    action$.pipe(
        ofType(REDIRECT_TO_UPDATE_PAGE.START),
        map((action) => {
          const {user, router} = action.payload;
          router.push(`/users/${user.id}`);
          return redirectToUpdatePageSuccess();
        }),
        catchError((error) => {
          const {status, name, message} = error;
          return of(redirectToUpdatePageError({status, name, message}));
        }),
    );
// EPICS - END

export const epics = [
  retrieveUsersListEpic,
  retrieveUserEpic,
  createUserEpic,
  createUserSuccessEpic,
  redirectToUpdatePageEpic,
  updateUserEpic,
  deleteUserEpic,
];
