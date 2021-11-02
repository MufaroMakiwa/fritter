const { v4: uuidv4 } = require("uuid");
const helpers = require('./helpers');
let data = [];


/**
 * @typedef Refreet
 * @prop {string} refreetId - The unique id of the refreet
 * @prop {string} userId - Id of refreeting user
 * @prop {string} freetId - The id of the freet refreeted
 * @prop {Date} dateRefreeted - The date the user refreetedd the freet 
 */

/**
 * @class Refreets
 * 
 * Stores all the refreets and provides an interface to add and remove refreets
 */

class Refreets {

  /**
   * Filter data and return sorted by dateRefreeted
   * 
   * @param {Function} func - The filter function to use
   * @return {Refreet[]} - Return the filtered data sorted
   */
  static filter(func) {
    return helpers.orderObjectsBy(
      data.filter(func),
      ['dateRefreeted'],
      'dateRefreeted',
      'DESC'
    )
  }
  /**
   * Check if a user has already refreeted a freet
   * 
   * @param {string} freetId - The id of the refreeted freet
   * @param {string} userId - The id of the refreeting user
   * @return {Refreet | undefined} - A refreet object if one exists, undefined otherwise
   */
   static findOne(freetId, userId) {
    return data.filter(refreet => {
      return refreet.freetId === freetId && refreet.userId === userId;
    })[0];
  }

  /**
   * Add a refreet by for a specific freet
   * 
   * @param {string} freetId - The id of the freet to refreet
   * @param {string} userId - The id of the refreeting user
   * @return {Refreet} - The newly created refreet object
   */
   static refreetOne(freetId, userId) {
    const refreet = {
      refreetId: uuidv4(),
      freetId: freetId,
      userId: userId,
      dateRefreeted: new Date(),
    };
    data.push(refreet);
    return refreet;
  }

  /**
   * Get all the refreets so far
   * 
   * @return {Refreet[]} an array of all of the refreets
   */
   static findAll() {
    return Refreets.filter(() => true);
  }

  /**
   * Remove refreet from a freet
   * 
   * @param {string} freetId - The id of a refreeted freet
   * @param {string} userId - The id of the refreeting user
   *
   */
   static unrefreetOne(freetId, userId) {
    const removedRefreet = Refreets.findOne(freetId, userId);
    data = data.filter(refreet => refreet.refreetId !== removedRefreet.refreetId);
  }

  /**
   * Remove all refreets by a user
   * 
   * @param {string} userId - The id of a refreeting user
   */
  static removeAllRefreetsByUserId(userId) {
    data = data.filter(refreet => refreet.userId !== userId);
  }


  /**
   * Remove all the refreets for a specific freet
   * 
   * @param {string} freetId - Freet whose refreets are to be removed
   */
  static removeAllRefreetsByFreetId(freetId) {
    data = data.filter(refreet => refreet.freetId !== freetId);
  }

  /**
   * Get all the refreeted freets by a user
   * 
   * @param {string} userId - The id of a refreeting user
   * @return {Refreet[]} - An array of refreet objects
   */
  static getAllRefreetsByUserId(userId) {
    return Refreets.filter(refreet => refreet.userId === userId);
  }

  /**
   * Get all the userIds of users who refreeted a freet
   * 
   * @param {string} freetId - Id of a freet
   * @return {Refreet[]} - An array of refreet objects
   */
  static getAllRefreetsByFreetId(freetId) {
    return Refreets.filter(refreet => refreet.freetId === freetId);
  }


  /**
   * Get refreets by given users
   * 
   * @param {UserId[]} userIds - An array of userIds
   * @return {Refreet[]} - An array of refreets by given users
   */
  static getAllRefreetsByUsers(userIds) {
    return Refreets.filter(refreet => userIds.includes(refreet.userId));
  }
}


module.exports = Refreets;