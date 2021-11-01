import axios from 'axios';


// return the query potion of a request formatted appropriately
function formatQuery(query) {
  return Object.keys(query)
    .map((key) => key + "=" + encodeURIComponent(query[key]))
    .join("&");
}


// Return true if a the status code is 2xx, false otherwise
export function isSuccess(response) {
  const statusCode = parseInt(response.status);
  return (statusCode >= 200) && (statusCode <= 299);
}


// Convert axios response object to an object with necessary properties
function convertToJSON(axiosResponse) {
  // Get the full response from axios
  const fullResponse = axiosResponse.response === undefined 
                       ? axiosResponse 
                       : axiosResponse.response;
  
  // Summarize the response
  return {
    data: fullResponse.data,
    status: fullResponse.status,
    isSuccess: isSuccess(fullResponse),
    statusText: fullResponse.statusText,
  };
}


/**
 * Create a get request to the server
 * 
 * @param {String} endpoint - The endpoint for the request
 * @param {Object} query - The query parameters for the request
 * @returns {Object} - The response for the request
 */
export function get(endpoint, query = {}) {
  const url = (Object.entries(query).length !== 0) 
                ? `${endpoint}?${formatQuery(query)}`
                : endpoint;

  return axios.get(url)
    .then(convertToJSON)
    .catch(convertToJSON)
}


/**
 * Create a post request to the server
 * 
 * @param {String} endpoint - The endpoint for the request
 * @param {Object} query - The body of the request
 * @returns {Object} - The response for the request
 */
export function post(endpoint, body = {}) {
  return axios.post(endpoint, body)
    .then(convertToJSON)
    .catch(convertToJSON)
}


/**
 * Create a put request to the server
 * 
 * @param {String} endpoint - The endpoint for the request
 * @param {Object} body - The body of the request
 * @returns {Object} - The response for the request
 */
 export function put(endpoint, body = {}) {
  return axios.put(endpoint, body)
    .then(convertToJSON)
    .catch(convertToJSON)
}

/**
 * Create a patch request to the server
 * 
 * @param {String} endpoint - The endpoint for the request
 * @param {Object} body - The body of the request
 * @returns {Object} - The response for the request
 */
 export function patch(endpoint, body = {}) {
  return axios.patch(endpoint, body)
    .then(convertToJSON)
    .catch(convertToJSON)
}


/**
 * Create a delete request to the server
 * 
 * @param {String} endpoint - The endpoint for the request
 * @returns {Object} - The response for the request
 */
 export function delete_(endpoint, options={}) {
  return axios.delete(endpoint, { data: options })
    .then(convertToJSON)
    .catch(convertToJSON)
}
