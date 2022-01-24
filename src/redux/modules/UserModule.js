import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {actionStates} from '../ModuleUtil';
import RxBackend from '../../utils/RxBackend';

// CONSTANTS - START
const INITIAL_STATE = {
  error: null,
  status: {inserted: false, updated: false, deleted: false},
};
// CONSTANTS - END

// ACTION TYPES - START
const RETRIEVE_LIST = actionStates('actions/USER_RETRIEVE_LIST');
const RETRIEVE_USER = actionStates('actions/RETRIEVE_USER');
const CREATE_USER = actionStates('actions/CREATE_USER');
const UPDATE_USER = actionStates('actions/UPDATE_USER');
const DELETE_USER = actionStates('actions/DELETE_USER');
const REDIRECT_TO_USERS_PAGE = actionStates('actions/REDIRECT_TO_USERS_PAGE');
const CLEAR_USER = "actions/CLEAR_USER";
const CLEAR_USER_STATUS = "actions/CLEAR_USER_STATUS";
// ACTION TYPES - END

// REDUCER - START
export const reducer = (state = INITIAL_STATE, {type, payload}) => {
  state = {...state, list: undefined};
  switch (type) {
    case RETRIEVE_LIST.SUCCESS:
      return {
        ...state,
        users: payload.users,
        count: payload.count
      };
    case RETRIEVE_USER.SUCCESS:
      return {
        ...state,
        user: payload.user
      };
    case RETRIEVE_LIST.ERROR:
      return {
        ...state,
        error: payload.error,
      };
    case CREATE_USER.SUCCESS:
      return {
        ...state,
        user: payload.user,
        status: {...state.status, inserted: true},
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
    case CLEAR_USER_STATUS:
      return {
        ...state,
        status: {...INITIAL_STATE.status}
      }
    case CLEAR_USER:
      return {
        ...state,
        user: null
      }
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
export const retrieveUsersOk = ({users, count}) => ({
  type: RETRIEVE_LIST.SUCCESS,
  payload: {users, count},
});
export const retrieveUsersKo = ({status, name, message}) => ({
  type: RETRIEVE_LIST.ERROR,
  payload: {status, name, message},
});

export const retrieveUser = (userId) => ({
  type: RETRIEVE_USER.START,
  payload: {userId}
});
export const retrieveUserOk = ({user}) => ({
  type: RETRIEVE_USER.SUCCESS,
  payload: {user}
});
export const retrieveUserKo = ({status, name, message}) => ({
  type: RETRIEVE_USER.ERROR,
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

export const updateUser = (user, router) => ({
  type: UPDATE_USER.START,
  payload: {user, router}
});
export const updateUserOk = (router) => ({
  type: UPDATE_USER.SUCCESS,
  payload: {router}
});
export const updateUserKo = ({status, name, message}) => ({
  type: UPDATE_USER.ERROR,
  payload: {status, name, message},
});

export const deleteUser = ({userId}) => ({
  type: DELETE_USER.START,
  payload: {userId}
});
export const deleteUserOk = (user) => ({
  type: DELETE_USER.SUCCESS,
  payload: {user}
});
export const deleteUserKo = () => ({
  type: DELETE_USER.ERROR,
  payload: {}
});
export const clearUser = () => ({
  type: CLEAR_USER
});
export const clearUserStatus = () => ({
  type: CLEAR_USER_STATUS,
});

export const redirectToUsersPageOk = () => ({
  type: REDIRECT_TO_USERS_PAGE.SUCCESS,
});

// ACTIONS - END

// EPICS - START
const retrieveUsersEpic = (action$, state$) =>
    action$.pipe(
        ofType(RETRIEVE_LIST.START),
        mergeMap((action) => {
          const {limit, offset} = action.payload;
          return RxBackend.ajaxGet({
            url: `api/users?limit=${limit}&offset=${offset}`
          }).pipe(
              map((resp) => retrieveUsersOk(
                  {users: resp.response.users, count: resp.response.count})),
              catchError((err) => {
                const {status, name, message} = err;
                return of(retrieveUsersKo({status, name, message}));
              }),
          );
        })
    );

const retrieveUserEpic = (action$, state$) =>
    action$.pipe(
        ofType(RETRIEVE_USER.START),
        mergeMap((action) => {
          const {userId} = action.payload;
          return RxBackend.ajaxGet({
            url: `api/users/${userId}`
          }).pipe(
              map((resp) => retrieveUserOk(
                  {user: resp.response})),
              catchError((err) => {
                const {status, name, message} = err;
                return of(retrieveUserKo({status, name, message}));
              }),
          )
        })
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
          return RxBackend.ajaxPost({
            url: `api/users`,
            body: {
              ...newUser
            }
          }).pipe(
              map(resp => createUserOk(router)),
              catchError(err => {
                const {status, name, message} = err;
                return of(createUserKo({status, name, message}));
              })
          )
        })
    );

const createUserOkEpic = (action$, state$) =>
    action$.pipe(
        ofType(CREATE_USER.SUCCESS),
        map(action => {
          const {router} = action.payload;
          console.log("create user ok", router)
          router.push("/users");
          return redirectToUsersPageOk();
        })
    );

const updateUserEpic = (action$, state$) =>
    action$.pipe(
        ofType(UPDATE_USER.START),
        mergeMap(action => {
          const {user, router} = action.payload;
          const newUser = Object.keys(user).reduce((userValues, key) => {
            const value = user[key];
            return !value ? userValues : {...userValues, [key]: value};
          }, {});
          console.log("put user", newUser);
          return RxBackend.ajaxPut({
            url: `api/users/${user.id}`,
            body: {
              ...newUser
            }
          }).pipe(
              map(resp => updateUserOk(router)),
              catchError(err => {
                const {status, name, message} = err;
                return of(updateUserKo({status, name, message}));
              })
          )
        })
    );

const updateUserOkEpic = (action$, state$) =>
    action$.pipe(
        ofType(UPDATE_USER.SUCCESS),
        map(action => {
          const {router} = action.payload;
          console.log("update user ok", router)
          router.push("/users");
          return redirectToUsersPageOk();
        })
    );

const deleteUserEpic = (action$, state$) =>
    action$.pipe(
        ofType(DELETE_USER.START),
        mergeMap(action => {
          const {userId} = action.payload;
          return RxBackend.ajaxDelete({
            url: `api/users/${userId}`
          }).pipe(
              map(resp => deleteUserOk(resp.response)),
              catchError(err => {
                const {status, name, message} = err;
                return of(deleteUserKo({status, name, message}));
              })
          )
        })
    );
// EPICS - END

export const epics = [
  retrieveUsersEpic,
  retrieveUserEpic,
  createUserEpic,
  createUserOkEpic,
  updateUserEpic,
  updateUserOkEpic,
  deleteUserEpic,
];