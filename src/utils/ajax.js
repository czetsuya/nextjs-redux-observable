import {request} from "universal-rxjs-ajax";

const defaultHeaders = {
  Authorization: 'czetsuyatech'
};

export const getHeaders = (headers) =>
    Object.assign({}, defaultHeaders, headers);

const ajaxRequest = (options) => {

  options.url = "http://localhost:3000/" + options.url;
  return request(options);
}

export const ajaxGet = ({url = "/", headers = {}}) => {

  const config = {
    url,
    method: 'GET',
    headers: getHeaders(headers)
  }

  return ajaxRequest(config);
}

export const ajaxPost = ({url = "/", headers = {}, body = {}}) => {

  const config = {
    url,
    method: 'POST',
    headers: getHeaders(headers),
    body
  }

  return ajaxRequest(config);
}