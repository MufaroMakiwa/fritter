const { v4: uuidv4 } = require("uuid");
let data = [];


/**
 * @typedef Like
 * @prop {string} likeId - The unique id of the like
 * @prop {string} userId - Id of liking user
 * @prop {string} freetId - The id of the freet liked
 * @prop {Date} dateLiked - The date the user liked the freet (may be used for notifs)
 */


/**
 * @class Likes
 * 
 * Stores all the likes and provides an interface to add and remove likes
 */

class Likes {

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
   * @return {UserId} - The id of the liking user
   */
  static likeOne(freetId, userId) {
    const like = {
      likeId: uuidv4(),
      freetId: freetId,
      userId: userId,
      dateLiked: new Date(),
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
    return data
            .filter(like => like.userId === userId)
            .map(like => like.freetId);
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
}

module.exports = Likes;