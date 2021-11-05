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
  const requests = isCurrentUser ? userRelations.getAllRequestsReceived(user.userId) : [];
  const requestsResponse = requests.map(request => constructUserRelationResponse(request, currentUserId))

  return { 
    userId: user.userId, 
    username: user.username,
    dateJoined: user.dateJoined,
    isPrivateAccount: user.isPrivateAccount,
    ...(isCurrentUser && { requestsReceived: requestsResponse }),
  };
}


/**
 * Get a freet object given the refreet object
 * 
 * @param {Refreet} refreet - A refreet 
 * @returns {Freet} - A freet object with with all details
 */
 const constructRefreetResponse = (refreet) => {
  const freet = freets.findOne(refreet.freetId);
  const constructedResponse = constructFreetResponse(freet);
  constructedResponse.dateRefreeted = refreet.dateRefreeted;
  constructedResponse.displayAsRefreet = true;
  constructedResponse.refreetedBy = users.findOneByUserId(refreet.userId).username;
  return constructedResponse;
} 


/**
 * Get a freet object given the liking object
 * 
 * @param {string} freetId - A freetId
 * @returns {Freet} - A freet object with all details
 */
 const constructLikeResponse = (freetId) => {
  const freet = freets.findOne(freetId);
  return constructFreetResponse(freet);
} 

/**
 * Get a more readable user relation object
 * 
 * @param {UserRelation} userRelation - The userRelation
 * @return {UserRelation} - A user relation object with the username not id
 */
const constructUserRelationResponse = (userRelation, currentUserId) => {
  const user = users.findOneByUserId(userRelation.userId);

  return {
    username: user.username,
    dateJoined: user.dateJoined,
    dateAdded: userRelation.dateAdded,
    relationStatus: userRelation.status,
    followingStatus: getFollowingStatus(currentUserId, userRelation.userId) 
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
  if (currentUserId === targetUserId) {
    return "NONE";
  }
  const relation = userRelations.findOne(currentUserId, targetUserId);
  if (relation === undefined) {
    return "NONE";
  }
  return relation.status;
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
// dateModified of freets and dateRefreeted for refreets
const mergeFreetsAndRefreets = (freetsResponse, refreetsResponse) => {
  let mergedResponse = [];

  let freetsIndex = 0;
  let refreetsIndex = 0;

  while (freetsIndex < freetsResponse.length && refreetsIndex < refreetsResponse.length) {
    let currentFreet = freetsResponse[freetsIndex];
    let currentRefreet = refreetsResponse[refreetsIndex];

    if (currentFreet.dateModified.getTime() > currentRefreet.dateRefreeted.getTime()) {
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
  refreetsResponse = refreetsResponse.map(constructRefreetResponse);

  return mergeFreetsAndRefreets(freetsResponse, refreetsResponse);
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
  getFreetsAndRefreetsFromFollowers
});

