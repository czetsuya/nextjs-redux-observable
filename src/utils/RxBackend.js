import {request} from "universal-rxjs-ajax";

const defaultHeaders = {
  Authorization: 'czetsuyatech'
};

export const getHeaders = (headers) =>
    Object.assign({}, defaultHeaders, headers);

const ajaxRequest = (options) => {

  options.url = process.env.NEXT_PUBLIC_API_URL + options.url;
  return request(options);
}

const ajaxGet = ({url = "/", headers = {}}) => {

  const config = {
    url,
    method: 'GET',
    headers: getHeaders(headers)
  }

  return ajaxRequest(config);
}

const ajaxPost = ({url = "/", headers = {}, body = {}}) => {

  const config = {
    url,
    method: 'POST',
    headers: getHeaders(headers),
    body
  }

  return ajaxRequest(config);
}

const ajaxPut = ({url = "/", headers = {}, body = {}}) => {

  const config = {
    url,
    method: 'PUT',
    headers: getHeaders(headers),
    body
  }

  return ajaxRequest(config);
}

const ajaxPatch = ({url = "/", headers = {}, body = {}}) => {

  const config = {
    url,
    method: 'PATCH',
    headers: getHeaders(headers),
    body
  }

  return ajaxRequest(config);
}

const ajaxDelete = ({url = "/", headers = {}}) => {

  const config = {
    url,
    method: 'DELETE',
    headers: getHeaders(headers)
  }

  return ajaxRequest(config);
}

const RxBackend = {
  ajaxGet,
  ajaxPost,
  ajaxPut,
  ajaxPatch,
  ajaxDelete
}

export default RxBackend;