const { v4: uuidv4 } = require("uuid");

let data = [];

/**
 * @typedef User
 * @prop {string} username - user's password
 * @prop {string} password - user's password
 * @prop {string} userId - user's userId
 * @prop {Date} dateJoined - The date the user joined
 * @prop {Boolean} isPrivateAccount - whether the user's account is private or not
 */

/**
 * @class Users
 * 
 * Stores all Users. Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Users {
  /**
   * Add a User to the collection.
   * 
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @param {string}  userId - user's userId
   * @return {User} - the newly created user
   */
  static addOne(username, password) {
    const userId = uuidv4();
    const dateJoined = new Date();
    const user = { userId, username, password, dateJoined, isPrivateAccount: false };
    data.push(user);
    return user;
  }

  /**
   * Get an array of users that satisfy the filter function
   * @param {Function} func - The filter method to use
   * @return {User[]} - an array of users that satisfy the filter method
   */
   static filter(func) {
    return data.filter(func);
  }

  /**
   * Find a User by userId.
   * 
   * @param {string} userId - The userId of the user to find
   * @return {User | undefined} - the found user with above username
   */
  static findOneByUserId(userId) {
    return data.filter(user => user.userId === userId)[0];
  }

  /**
   * Find a User by Name.
   * 
   * @param {string} username - The username of the user to find
   * @return {User | undefined} - the found user with above username
   */
  static findOneByUsername(username) {
    return data.filter(user => user.username.toLowerCase() === username.toLowerCase())[0];
  }


  /**
   * 
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {User} - The updated user
   */
  static updateOne(userId, userDetails) {
    const user = Users.findOneByUserId(userId);
    userDetails.password !== undefined && (user.password = userDetails.password);
    userDetails.username !== undefined && (user.username = userDetails.username);
    userDetails.isPrivateAccount !== undefined && (
      user.isPrivateAccount = userDetails.isPrivateAccount
    );
    return user;
  }


  /**
   * Delete a User from the collection.
   * 
   * @param {string} userId - userId of User to delete
   * @return {User | undefined} - deleted User
   */
  static deleteOne(userId) {
    const user = Users.findOneByUserId(userId);
    data = data.filter(s => s.userId !== userId);
    return user;
  }
}

module.exports = Users;