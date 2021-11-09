const users = require('../models/users');
const freets = require('../models/freets');
const likes = require('../models/likes');
const refreets = require('../models/refreets');
const userRelations = require('../models/user-relations');

/**
 * Return the username of user
 * 
 * @param {string} userId - UserID of given user
 * @return {string} - Username of user with given ID
 */
const getUsername = (userId) => {
  return users.findOneByUserId(userId).username;
}

/**
 * Get follow suggestions for a user
 * 
 * @param {string} userId - id of user
 * @return {String[]} - an array of usernames
 */
const getFollowSuggestions = (userId) => {
  let publicUsers;

  if (userId !== null) {
    const requests = userRelations.getAllRequestsSent(userId).map(relation => relation.userId);
    const following = userRelations.getAllFollowing(userId).map(relation => relation.userId);
    const excludedUserIds = requests.concat(following, userId);

    publicUsers = users.filter(user => {
      return !user.isPrivateAccount && !excludedUserIds.includes(user.userId)
    });
  } else {
    publicUsers = users.filter(user => !user.isPrivateAccount);
  }

  // get the suggestions
  const suggestions = userRelations.getSortedByFollowers(publicUsers.map(user => user.userId));

  // construct the response with at most 5 suggestions
  return suggestions
          .map(suggestion => {
            return {
              username: users.findOneByUserId(suggestion.userId).username,
              followers: suggestion.followers,
              following: suggestion.following,
            }
          })
          .sort((a, b) => a.followers > b.followers ? -1 : 1)
          .slice(0, 5);
}

/**
 * Get a freet object that is more readable
 * 
 * @param {Freet} freet - A freet 
 * @returns {Freet} - A freet object with author username instead of id
 */
const constructFreetResponse = (freet) => {
  const username = getUsername(freet.authorId);
  const freetRefreets = refreets.getAllRefreetsByFreetId(freet.freetId);
  const freetLikes = likes.getAllLikesByFreetId(freet.freetId);
  
  return { 
    freetId: freet.freetId,
    author: username,
    content: freet.content,
    dateCreated: freet.dateCreated,
    dateModified: freet.dateModified,
    likes: freetLikes.map(getUsername),
    refreets: freetRefreets.map(refreet => getUsername(refreet.userId))
  }
} 

/**
 * Get the user object without the password
 * 
 * @param {User} user - A user object
 * @param {string} currentUserId - The id of the current session user
 * @returns - The user object without the password
 */
const constructUserResponse = (user, currentUserId) => {
  const isCurrentUser = currentUserId !== undefined && currentUserId === user.userId;

  return { 
    userId: user.userId, 
    username: user.username,
    dateJoined: user.dateJoined,
    isPrivateAccount: user.isPrivateAccount,
    ...(isCurrentUser && { notifications: getNotifications(currentUserId) }),
  };
}


/**
 * Get a freet object given the refreet object
 * 
 * @param {Refreet} refreet - A refreet object
 * @param {Boolean} includeStatus - Whether to include the like notificationStatus
 * @returns {Freet} - A freet object with with all details
 */
 const constructRefreetResponse = (refreet, includeStatus = false) => {
  const freet = freets.findOne(refreet.freetId);
  const constructedResponse = constructFreetResponse(freet);

  // if includeStatus is true, we do not want to display the refreet tag
  // because this will be for the notifications
  constructedResponse.displayAsRefreet = !includeStatus;

  constructedResponse.refreetDetails = {
    ...includeStatus && { notificationStatus: refreet.notificationStatus },
    ...includeStatus && { refreetId: refreet.refreetId },
    refreetedBy: users.findOneByUserId(refreet.userId).username,
    dateAdded: refreet.dateAdded
  }
  return constructedResponse;
} 


/**
 * Get a freet object given the liking object
 * 
 * @param {Like} like - A like object
 * @param {Boolean} includeStatus - Whether to include the like notificationStatus
 * @returns {Freet} - A freet object with all details
 */
 const constructLikeResponse = (like, includeStatus = false) => {
  const freet = freets.findOne(like.freetId);
  const constructedResponse = constructFreetResponse(freet);
  constructedResponse.likeDetails = {
    ...includeStatus && { notificationStatus: like.notificationStatus },
    ...includeStatus && { likeId: like.likeId },
    likedBy: users.findOneByUserId(like.userId).username,
    dateAdded: like.dateAdded,
  }
  return constructedResponse;
} 

/**
 * Get a more readable user relation object
 * 
 * @param {UserRelation} userRelation - The userRelation
 * @param {string} currentUserId - User id of the current user
 * @param {BOolean} includeNotificationStatus - Whether to inlcude the notification status
 * @return {UserRelation} - A user relation object with the username not id
 */
const constructUserRelationResponse = (userRelation, currentUserId, includeNotificationStatus = false) => {
  const user = users.findOneByUserId(userRelation.userId);

  // Get the notification status which is either for the target or follower
  const getNotificationStatus = () => {
    if (userRelation.targetNotificationStatus === "NONE") {
      return userRelation.followerNotificationStatus;

    } else {
      return userRelation.targetNotificationStatus;
    }
  }

  return {
    username: user.username,
    dateJoined: user.dateJoined,
    dateAdded: userRelation.dateAdded,
    relationStatus: userRelation.status,
    followingStatus: getFollowingStatus(currentUserId, userRelation.userId),
    ...includeNotificationStatus && { notificationStatus: getNotificationStatus() },
    ...includeNotificationStatus && { relationId: userRelation.relationId }
  }
}


/**
 * Get relationship status between two users
 * 
 * @param {string} currentUserId - Id of the current user
 * @param {string} targetUserId - Id of the target user
 * @return {string} - The relationship status between the two users
 */
const getFollowingStatus = (currentUserId, targetUserId) => {
  if (!currentUserId || currentUserId === targetUserId) {
    return "NONE";
  }
  const relation = userRelations.findOne(currentUserId, targetUserId);
  if (relation === undefined) {
    return "NONE";
  }
  return relation.status;
}

/**
 * Check if user follows current user
 * 
 * @param {string} currentUserId - Id of the current user
 * @param {string} targetUserId - Id of the target user
 * @return {Boolean} - Whether target user follows current session user
 */
const isFollowingCurrentUser = (currentUserId, targetUserId) => {
  if (!currentUserId || currentUserId === targetUserId) {
    return false;
  }
  const relation = userRelations.findOne(targetUserId, currentUserId);
  if (relation === undefined) {
    return false;
  }
  return relation.status === "ACTIVE";
}

/**
 * Check if the current session user is allowed to get another user's
 * private information
 * 
 * @param {string} currentUserId - Id of current session user, undefined if not exist
 * @param {string} targetUserId - The id of the target user
 * @return {Boolean} - true if the user is allowed to see the user's
 *                     private information, i.e, likes, followers and following
 */
const addPrivateInformation = (currentUserId, targetUserId) => {
  // if the user is not logged in
  if (currentUserId === undefined) {
    return false;
  }

  // if the user is the owner of the account
  if (currentUserId === targetUserId) {
    return true;
  }

  const targetUser = users.findOneByUserId(targetUserId);

  // if the target account is not private, return true
  if (!targetUser.isPrivateAccount) {
    return true;
  }

  // if the account is private check if the currentUser is a follower of not
  // of target user If true, return, true else return false
  const relation = userRelations.findOne(currentUserId, targetUserId);
  return relation !== undefined && relation.status === "ACTIVE";
}


// Given freets and refreets response, merge then to be in descending order of 
// dateModified of freets and dateAdded for refreets
const mergeFreetsAndRefreets = (freetsResponse, refreetsResponse) => {
  let mergedResponse = [];

  let freetsIndex = 0;
  let refreetsIndex = 0;

  while (freetsIndex < freetsResponse.length && refreetsIndex < refreetsResponse.length) {
    let currentFreet = freetsResponse[freetsIndex];
    let currentRefreet = refreetsResponse[refreetsIndex];

    if (currentFreet.dateModified.getTime() > currentRefreet.refreetDetails.dateAdded.getTime()) {
      mergedResponse.push(currentFreet);
      freetsIndex++;

    } else {
      mergedResponse.push(currentRefreet);
      refreetsIndex++;
    }
  }

  // get all the remainder freets if any
  while(freetsIndex < freetsResponse.length) {
    mergedResponse.push(freetsResponse[freetsIndex]);
    freetsIndex++;
  }

  // get all the remainder refreets if any
  while(refreetsIndex < refreetsResponse.length) {
    mergedResponse.push(refreetsResponse[refreetsIndex]);
    refreetsIndex++;
  }

  return mergedResponse;
}


// get all the freets by a given users, following or all the freets
const getFreetsAndRefreetsFromFollowers = (userId) => {
  let freetsResponse;
  let refreetsResponse;

  if (userId !== undefined) {
    // get freets and refreets from users being followed
    const following = userRelations.getAllFollowing(userId);
    const followingUserIds = following.map(relation => relation.userId);

    // add current userId to also display need to include the user freets
    followingUserIds.push(userId);

    freetsResponse = freets.getAllFreetsByUsers(followingUserIds);
    refreetsResponse = refreets.getAllRefreetsByUsers(followingUserIds);

  } else {
    // get all the freets and refreets
    freetsResponse = freets.findAll();
    refreetsResponse = [];
  }

  // for freets, construct the response and set displayAsRefreet to be false
  freetsResponse = freetsResponse.map(freet => {
    const constructedResponse = constructFreetResponse(freet);
    constructedResponse.displayAsRefreet = false;
    return constructedResponse;
  });

  // for refreets, construct the response and set displayAsRefreet to be true as well as
  // the refreeting user
  refreetsResponse = refreetsResponse.map(refreet => constructRefreetResponse(refreet));
  return mergeFreetsAndRefreets(freetsResponse, refreetsResponse);
}


/**
 * 
 * Get a list of popular freets. Freets are popular by the total number of
 * like and refreets
 * 
 * @param {string} userId - id of the current session user
 * @return {Freet[]} - A list of all freets from users you do not follow sorted by popularity
 */
const getPopularFreets = (userId) => {

  // get the total number or likes and refreets for a freet
  const getLikesAndRefreetsTotal = (freetId) => {
    const likesResponse = likes.getAllLikesByFreetId(freetId);
    const refreetsResponse = refreets.getAllRefreetsByFreetId(freetId);
    return likesResponse.length + refreetsResponse.length;
  }

  let excludeFreetIds;

  if (userId !== undefined) {
    // get freets from users being followed and pending
    const followingUserIds = userRelations.getAllFollowing(userId).map(relation => relation.userId);
    followingUserIds.push(userId);
    const pendingRequestUserIds = userRelations.getAllRequestsSent(userId).map(relation => relation.userId);

    excludeFreetIds = freets
                        .getAllFreetsByUsers(followingUserIds.concat(pendingRequestUserIds))
                        .map(freet => freet.freetId);

  } else {
    excludeFreetIds = [];
  }

  return freets
          .findAll()
          .filter(freet => !excludeFreetIds.includes(freet.freetId))
          .sort((a, b) => {
            if (getLikesAndRefreetsTotal(a.freetId) > getLikesAndRefreetsTotal(b.freetId)) {
              return -1;
              
            } else {
              return 1;
            }
          })
          .map(freet => constructFreetResponse(freet))
}


/**
 * Get all notifications
 * 
 * @param {string} currentUserId - Id of the current user
 * @return {Object[]} - A list of all the notifications sorted in dateAdded
 */
const getNotifications = (currentUserId) => {
  // get follow requests for user
  const requests = userRelations.getAllRequestsReceived(currentUserId);
  const requestsResponse = requests.map(request => constructUserRelationResponse(request, currentUserId, true));

  // get all the followers without the hidden status
  const followers = userRelations.getAllFollowers(currentUserId);
  const followersResponse = followers
                              .filter(relation => relation.targetNotificationStatus !== "NONE")
                              .map(relation => constructUserRelationResponse(relation, currentUserId, true))
                              .map(relation => {
                                // indicate that each of the relations is not acceptedRequest
                                relation.isAcceptedRequest = false;
                                return relation;
                              });

  // get all the accepted follow request
  const following = userRelations.getAllFollowing(currentUserId);
  const requestsAcceptedResponse = following
                                    .filter(relation => relation.followerNotificationStatus !== "NONE")
                                    .map(relation => constructUserRelationResponse(relation, currentUserId, true))
                                    .map(relation => {
                                      // indicate that each of the relations is an acceptedRequest
                                      relation.isAcceptedRequest = true;
                                      return relation;
                                    });

  // get the refreets for the user
  const userRefreets = refreets.getAllRefreetsForUser(currentUserId, false);
  const refreetsResponse = userRefreets.map(refreet => constructRefreetResponse(refreet, true));

  // get the likes for the user
  const userLikes = likes.getAllLikesForUser(currentUserId, false);
  const likesResponse = userLikes.map(like => constructLikeResponse(like, true))

  // get the sorting date from the given notification object
  const getDate = (notification) => {
    if (notification.refreetDetails !== undefined) {
      return notification.refreetDetails.dateAdded.getTime();
    }
    if (notification.likeDetails !== undefined) {
      return notification.likeDetails.dateAdded.getTime();
    }
    return notification.dateAdded.getTime();
  }

  return requestsResponse
            .concat(refreetsResponse, likesResponse, followersResponse, requestsAcceptedResponse)
            .sort((a, b) => getDate(a) > getDate(b) ? -1 : 1);
}



module.exports = Object.freeze({
  getUsername,
  getFollowingStatus,
  constructFreetResponse,
  constructUserResponse,
  constructRefreetResponse,
  constructLikeResponse,
  constructUserRelationResponse,
  addPrivateInformation,
  getFreetsAndRefreetsFromFollowers,
  getFollowSuggestions,
  isFollowingCurrentUser,
  getNotifications,
  getPopularFreets
});

