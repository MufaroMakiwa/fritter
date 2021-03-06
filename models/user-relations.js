const { v4: uuidv4 } = require("uuid");
const helpers = require('./helpers');
const starter = require('./data/user-relations');
let data = starter.map(a => {return {...a}});

/**
 * @typedef UserRelation
 * @prop {string} relationId - unique id of the user relation
 * @prop {string} followerId - userId of following user
 * @prop {string} targetUserId - ID of user being followed
 * @prop {string} status - Status of the relation: ACTIVE or PENDING
 * @prop {string} targetNotificationStatus - NEW, SEEN, OPENED, NONE: whether target saw the follow
 * @prop {string} followerNotificationStatus - NEW, SEEN, OPENED, NONE: whether follower saw the acceptance
 * @prop {Date} dateAdded - The date that the user relation was made. When it is
 *                          an accepted request this will be the date when it was accepted
 */


/**
 * @class UserRelations
 * 
 * Stores all the user relations and provides an interface to modify the relations
 */

class UserRelations {

  /**
   * Filter data and return sorted by dateAdded
   * 
   * @param {Function} func - The filter function to use
   * @return {UserRelation[]} - Return the filtered data sorted
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
   * Sort users by followers
   * 
   * @param {String[]} userIds - An array of userIds
   * @return {Object[]} - An array of user objects with their followers sorted by 
   *                      number of followers
   */
  static getSortedByFollowers(userIds) {
    let stats = userIds.reduce((obj, userId) => {
      obj[userId] = { followers: 0, following: 0, userId: userId };
      return obj
    }, {});

    // get to user follower and following count
    data.forEach(userRelation => {

      // if it is a follow request, skip it
      if (userRelation.status !== "ACTIVE") {
        return;
      }

      const followerId = userRelation.followerId;
      const targetUserId = userRelation.targetUserId;

      if (followerId in stats) {
        stats[followerId].following ++;
      }

      if (targetUserId in stats) {
        stats[targetUserId].followers ++;
      }
    })

    // get the list of objects
    return userIds
            .map(userId => stats[userId])
            .sort((a, b) => a.followers > b.followers ? 1 : -1);
    
  }

  /**
   * Check if user with followerId follows or sent follow request to user with targetUserId
   * 
   * @param {string} followerId - Id of following user
   * @param {string} targetUserId - Id of user being followed
   * @returns {UserRelation | undefined} - An object that represents the relation,
   *                                       undefined if it does not exist
   */
  static findOne(followerId, targetUserId) {
    return data.filter(relation => {
      return relation.followerId === followerId 
             && relation.targetUserId === targetUserId;
    })[0];
  }


  /**
   * Add user with id followerId follow user with id targetUserId
   * 
   * @param {string} followerId - Id of following user
   * @param {string} targetUserId - Id of user being followed
   * @return {Object} - Contains target userId and dateAdded
   */
  static followOne(followerId, targetUserId, status = "ACTIVE") {
    const dateAdded = new Date();
    const relation = {
      relationId: uuidv4(),
      followerId: followerId,
      targetUserId: targetUserId,
      status: status,
      dateAdded: dateAdded,
      targetNotificationStatus: "NEW",
      followerNotificationStatus: "NONE"
    }
    data.push(relation);

    return { 
      relationId: relation.relationId,
      userId: targetUserId, 
      dateAdded, 
      status, 
      targetNotificationStatus: "NEW",
      followerNotificationStatus: "NONE"
    };
  }

  /**
   * Accept a follow request
   * 
   * @param {string} followerId - Id of following user
   * @param {string} targetUserId - Id of user being followed
   * @return {Object} - The updated user relation object
   */
  static acceptFollowRequest(followerId, targetUserId) {
    const relation = UserRelations.findOne(followerId, targetUserId);
    relation.status = "ACTIVE";
    relation.dateAdded = new Date();
    relation.targetNotificationStatus = "NONE";
    relation.followerNotificationStatus = "NEW";
    
    return {
      relationId: relation.relationId,
      userId: relation.followerId,
      dateAdded: relation.dateAdded,
      status: relation.status,
      targetNotificationStatus: relation.targetNotificationStatus,
      followerNotificationStatus: relation.followerNotificationStatus
    } 
  }


  /**
   * Remove user with id followerId from following user with id targetUserId
   * 
   * @param {string} followerId - Id of following user
   * @param {string} targetUserId - Id of user being followed
   */
  static unfollowOne(followerId, targetUserId) {
    const removedRelation = UserRelations.findOne(followerId, targetUserId);
    data = data.filter(relation => relation.relationId !== removedRelation.relationId);
    return removedRelation;
  }


  /**
   * Remove all the users that the user with userId follows
   * 
   * @param {string} userId - Id of the user 
   */
  static unfollowAll(userId) {
    data = data.filter(relation => relation.followerId !== userId);
  }


  /**
   * Remove all the users that follow the user with id userId
   * 
   * @param {string} userId - Id of user 
   */
  static removeAllFollowers(userId) {
    data = data.filter(relation => relation.targetUserId !== userId);
  }


  /**
   * Find all the users that follow user with id userID
   * 
   * @param {string} userId - Id of user 
   * @return @return {Object[]} - Contains userIds of users following userId and dateAdded
   */
  static getAllFollowers(userId) {
    return UserRelations
            .filter(relation => relation.targetUserId === userId && relation.status === "ACTIVE")
            .map(relation => {
              return {
                relationId: relation.relationId,
                userId: relation.followerId,
                dateAdded: relation.dateAdded,
                status: relation.status,
                targetNotificationStatus: relation.targetNotificationStatus,
                followerNotificationStatus: relation.followerNotificationStatus
              }
            });
  }


  /**
   * Find all the users that are followed by user with id userID
   * 
   * @param {string} userId - Id of user
   * @return {Object[]} - An array of all the users that user with userId follows and dateAdded
   */
   static getAllFollowing(userId) {
    return UserRelations
            .filter(relation => relation.followerId === userId && relation.status === "ACTIVE")
            .map(relation => {
              return {
                relationId: relation.relationId,
                userId: relation.targetUserId,
                dateAdded: relation.dateAdded,
                status: relation.status,
                targetNotificationStatus: relation.targetNotificationStatus,
                followerNotificationStatus: relation.followerNotificationStatus
              }
            });
  }


  /**
   * Find all the pending follow requests sent
   * 
   * @param {string} userId - Id of user 
   * @return {Object[]} - An array of all the pending follow requests sent and dateAdded
   */
   static getAllRequestsSent(userId) {
    return UserRelations
            .filter(relation => relation.followerId === userId && relation.status === "PENDING")
            .map(relation => {
              return {
                relationId: relation.relationId,
                userId: relation.targetUserId,
                dateAdded: relation.dateAdded,
                status: relation.status,
                targetNotificationStatus: relation.targetNotificationStatus,
                followerNotificationStatus: relation.followerNotificationStatus
              }
            });
  }

  
  /**
   * Find all the pending follow requests received
   * 
   * @param {string} userId - Id of user 
   * @return {Object[]} - An array of all the pending follow requests received
   */
   static getAllRequestsReceived(userId) {
    return UserRelations
            .filter(relation => relation.targetUserId === userId && relation.status === "PENDING")
            .map(relation => {
              return {
                relationId: relation.relationId,
                userId: relation.followerId,
                dateAdded: relation.dateAdded,
                status: relation.status,
                targetNotificationStatus: relation.targetNotificationStatus,
                followerNotificationStatus: relation.followerNotificationStatus
              }
            });
  }

  /**
   * Accept all follow request for the user with given userId
   * 
   * @param {string} userId - The id of the user whose follow requests are to be accepted
   */
  static acceptAllRequestReceived(userId) {
    data = data.map(relation => {
      if (relation.targetUserId === userId && relation.status === "PENDING") {
        relation.status = "ACTIVE";
        relation.dateAdded = new Date();
        relation.targetNotificationStatus = "NONE",
        relation.followerNotificationStatus = "NEW"
      }
      return relation;
    });
  }


  /**
   * Update the notification status of a relation
   * 
   * @param {string} relationIds - Relation ids to update status for
   * @param {string} updatedStatus - The status to update with
   * @param {string} notificationField - The notification status field to update
   */
  static updateRelationNotificationStatus(relationIds, updatedStatus, notificationField) {
    data = data.map(relation => {
      if (relationIds.includes(relation.relationId)) {
        if (relation[notificationField] !== "OPENED" && relation[notificationField] !== "NONE") {
          relation[notificationField] = updatedStatus;
        }
      } 
      return relation;
    })
  }
}

module.exports = UserRelations;