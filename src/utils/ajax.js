const defaultHeaders = {
  Authorization: 'czetsuyatech'
};

export const getHeaders = (headers) =>
    Object.assign({}, defaultHeaders, headers);