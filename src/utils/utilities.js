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

/**
 * Get time past
 * 
 * @param {Date} date - The date a resource was created on modified
 * @return {String} - The time between when a resource was modified and now
 */
export function formattedTimePast(date) {
  const resourceDate = new Date(date);
  const then = resourceDate.getTime();
  const now = new Date().getTime(); 

  let difference = Math.round((now - then) / 1000);

  // if no difference, return now
  if (difference === 0) {
    return "just now";
  }

  // if it still seconds past, return the number of seconds
  if (difference < 60) {
    return `${difference} sec. ago`;
  }

  // if it is still minutes past, return the number of minutes
  difference = Math.round(difference / 60);
  if (difference < 60) {
    return `${difference} min. ago`;
  }

  // if it is still hours past, return then number of hours
  difference = Math.round(difference / 60);
  if (difference < 24) {
    return `${difference} hr. ago`;
  }

  const monthMap = {
    0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "June",
    6: "July", 7: "Aug", 8: "Sept", 9: "Oct", 10: "Nov", 11: "Dec"
  }

  // In all the other cases, return the month short, the date and year
  const month = resourceDate.getMonth();
  const day = resourceDate.getDay();
  const thenYear = resourceDate.getFullYear();
  const nowYear = resourceDate.getFullYear();

  return nowYear !== thenYear
          ? `${monthMap[month]} ${day}, ${thenYear}`
          : `${monthMap[month]} ${day}`

}