/**
 * Get a clone of an Object
 * 
 * @param {Object} object - Any model object
 * @returns {Object} - A clone of the passed object
 */
 const copyObject = (object) => {
  return JSON.parse(JSON.stringify(object));
}


/**
 * Get all the object sorted in order specified
 * 
 * @param {Object[]} objects - An array of objects
 * @param {String[]} dateFields - The date fields for this object 
 * @param {string} property - A property of the object
 * @param {string} order - The order to sort the freets
 * @return {Object[]} objects - An array of the objects sorted in order
 */
const orderObjectsBy = (objects, dateFields, property, order) => {
  let direction = (order === 'ASC') ? 1 : -1;
  return objects
          .map(object => copyObject(object))
          .map(object => {
            dateFields.forEach(field => {
              object[field] = new Date(object[field]);
            })
            return object;
          })
          .sort((a, b) => (a[property] > b[property]) ? direction : -direction);
}

module.exports = Object.freeze({
  orderObjectsBy,
  copyObject
});