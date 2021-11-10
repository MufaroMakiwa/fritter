const { v4: uuidv4 } = require("uuid");
const helpers = require('./helpers');
const starter = require('./data/freets');
let data = starter.map(a => {return {...a}});


/**
 * @typedef Freet
 * @prop {string} freetId - The unique id of the freet
 * @prop {string} authorId - Author userId
 * @prop {Date} dateCreated - The date the freet was added
 * @prop {string} content - Content of the freet
 * @prop {Date} dateModified - The date the freet was modified
 */


/**
 * @class Freets
 * 
 * Stores all the freets and provides an interface to modify the freets
 */

class Freets {

  /**
   * Get an array of freets that satisfy the filter function
   * 
   * @param {Function} func - The filter method to use
   * @param {string} orderBy - The property to use for ordering
   * @param {string} order - The sorting order
   * @return {Freet[]} - an array of freets that satisfy the filter method
   */
   static filter(func, orderBy='dateModified', order='DESC') {
    return helpers.orderObjectsBy(
      data.filter(func), 
      ['dateCreated', 'dateModified'],
      orderBy, 
      order
    );
  }

  /**
   * Add a freet to the collection
   * 
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Freet} - The newly created freet
   */
  static addOne(authorId, content) {
    const freetId = uuidv4();
    const date = new Date();
    const freet = {
      freetId: freetId,
      authorId: authorId,
      dateCreated: date,
      content: content,
      dateModified: date,
    }
    data.push(freet);
    return freet;
  }

  /**
   * Find a freet by freetId
   * 
   * @param {string} freetId - The id of the freet to find
   * @return {Freet | undefined} - The freet object or undefined if it does not exist
   */
  static findOne(freetId) {
    return data.filter(freet => freet.freetId === freetId)[0];
  }

  /**
   * Get all the freets so far
   * 
   * @param {string} orderBy - The property to the order the freets by
   * @param {string} order - The order for the freets, i.e, ASC or DESC
   * @return {Freet[]} an array of all of the freets
   */
  static findAll(orderBy='dateModified', order='DESC') {
    return Freets.filter(() => true, orderBy, order);
  }

  /**
   * Update a freet with the new content
   * 
   * @param {string} freetId The id of the freet to be updated
   * @param {string} content The new content of the freet
   * @return {Freet} - The newly updated freet
   */
  static updateOne(freetId, content) {
    const freet = Freets.findOne(freetId);
    freet.content = content;
    freet.dateModified = new Date();
    return freet;
  }

  /**
   * Delete a Freet from the collection.
   * 
   * @param {string} freetId - Id of the freet to delete
   * @return {Freet | undefined} - deleted Freet
   */
   static deleteOne(freetId) {
    data = data.filter(freet => freet.freetId !== freetId);
  }

  /**
   * Get all the freets by a user
   * 
   * @param {string} userId - The id of a  user
   * @return {Freet[]} - An array of freet objects
   */
  static getAllFreetsByUserId(userId) {
    return Freets.filter(freet => freet.authorId === userId)
  }

  /**
   * Delete all the freets by given user 
   * 
   * @param {string} userId - The id of the user
   */
   static removeFreetsByUserId(userId) {
    data = data.filter(freet => freet.authorId !== userId);
  }

  /**
   * Get freets by given users
   * 
   * @param {String[]} userIds - an array of userIds
   * @return {Freet[]} - an array of freets
   */
  static getAllFreetsByUsers(userIds) {
    return Freets.filter(freet => userIds.includes(freet.authorId));
  }
}

module.exports = Freets;