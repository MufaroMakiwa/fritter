const { v4: uuidv4 } = require("uuid");
const helpers = require('./helpers');
let data = [];


/**
 * @typedef Like
 * @prop {string} likeId - The unique id of the like
 * @prop {string} userId - Id of liking user
 * @prop {string} authorId - The id of the author of the freet
 * @prop {string} notificationStatus - NEW, SEEN, OPENED. NEW at created, SEEN when notif loaded, OPENED when clicked
 * @prop {string} freetId - The id of the freet liked
 * @prop {Date} dateAdded - The date the user liked the freet (may be used for notifs)
 */


/**
 * @class Likes
 * 
 * Stores all the likes and provides an interface to add and remove likes
 */

class Likes {

  /**
   * Filter data and return sorted by dateAdded
   * 
   * @param {Function} func - The filter function to use
   * @return {Like[]} - Return the filtered data sorted
   */
   static filter(func) {
    return helpers.orderObjectsBy(
      data.filter(func),
      ['dateAdded'],
      'dateAdded',
      'DESC'
    )
  }

  /**
   * Check if a user has already liked a freet
   * 
   * @param {string} freetId - The id of the liked freet
   * @param {string} userId - The id of the liking user
   * @return {Like | undefined} - A like object if one exists, undefined otherwise
   */
  static findOne(freetId, userId) {
    return data.filter(like => {
      return like.freetId === freetId && like.userId === userId;
    })[0];
  }

  /**
   * Add a like by for a specific freet
   * 
   * @param {string} freetId - The id of the freet to like
   * @param {string} userId - The id of the liking user
   * @param {string} authorId - The id of the author of the freet
   * @return {UserId} - The id of the liking user
   */
  static likeOne(freetId, userId, authorId) {
    const like = {
      likeId: uuidv4(),
      freetId: freetId,
      userId: userId,
      authorId: authorId,
      dateAdded: new Date(),
      notificationStatus: userId === authorId ? "OPENED" : "NEW"
    };
    data.push(like);
    return userId;
  }

  /**
   * Remove like from a freet
   * 
   * @param {string} freetId - The id of a liked freet
   * @param {string} userId - The id of the liking user
   *
   */
  static dislikeOne(freetId, userId) {
    const removedLike = Likes.findOne(freetId, userId);
    data = data.filter(like => like.likeId !== removedLike.likeId);
    return userId;
  }

  /**
   * Remove all likes by a user
   * 
   * @param {string} userId - The id of a liking user
   */
  static removeAllLikesByUserId(userId) {
    data = data.filter(like => like.userId !== userId);
  }


  /**
   * Remove all the likes for a specific freet
   * 
   * @param {string} freetId - Freet whose likes are to be removed
   */
  static removeAllLikesByFreetId(freetId) {
    data = data.filter(like => like.freetId !== freetId);
  }

  /**
   * Get all the liked freets by a user
   * 
   * @param {string} userId - The id of a liking user
   * @return {freetId[]} - An array of freetIds
   */
  static getAllLikesByUserId(userId) {
    return Likes.filter(like => like.userId === userId);     
  }

  /**
   * Get all the userIds of users who liked a freet
   * 
   * @param {string} freetId - Id of a freet
   * @return {UserId[]} - An array of userIds
   */
  static getAllLikesByFreetId(freetId) {
    return data
            .filter(like => like.freetId === freetId)
            .map(like => like.userId);
  }

  /**
   * Get likes for the given user' freets
   * 
   * @param {string} userId - Id of the user
   * @param {Boolean} includeAuthorLikes - Whether to include the author's likes
   * @return {Like[]} - An array of likes
   */
   static getAllLikesForUser(userId, includeAuthorLikes) {
    return Likes.filter(like => {
      if (like.authorId !== userId) {
        return false;
      }
      if (!includeAuthorLikes && like.userId === userId) {
        return false;
      }
      return true;
    })
  }

  /**
   * Update the notification status of the like
   * 
   * @param {String[]} likeIds - Ids of likes whose notif status is to be updated 
   * @param {string} updatedStatus - The new status for the like
   * 
   */
  static updateLikeNotificationStatus(likeIds, updatedStatus) {
    data = data.map(like => {
      if (likeIds.includes(like.likeId) && like.notificationStatus !== "OPENED") {
        like.notificationStatus = updatedStatus;
      }
      return like;
    });
  }
}

module.exports = Likes;