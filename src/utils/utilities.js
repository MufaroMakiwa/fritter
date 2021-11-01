import moment from 'moment';


/**
 * Return a human readable form of a date
 * 
 * @param {String} date - string representation of a date object with time
 * @returns {String} - nicely formatted date
 */
export function formattedDateTime(date) {
  const dateFormat = "MMMM Do YYYY, h:mm:ss a";
  return moment(date).format(dateFormat);
}


/**
 * Return a human readable form of a date
 * 
 * @param {String} date - string representation of a date object without time
 * @returns {String} - nicely formatted date
 */
 export function formattedDate(date) {
  const dateFormat = "MMMM Do YYYY";
  return moment(date).format(dateFormat);
}
