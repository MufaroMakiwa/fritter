const express = require('express');
const users = require('../models/users');
const freets = require('../models/freets');
const userRelations = require('../models/user-relations');
const refreets = require('../models/refreets');
const likes = require('../models/likes');
const validator = require('./middleware');
const utils = require('./utilities');
const router = express.Router();


/**
 * Get search suggestions based on the query
 * 
 * @name GET /user/search
 * @return {String[]} - A list of usernames that start with the given query
 */
router.get('/search', (req, res) => {
  const suggestions = 
          users
            .filter(user => {
              return user.username.toLowerCase().includes(req.query.querytext.toLowerCase())
            })
            .map(user => user.username)
            .sort((a, b) => a > b ? 1: -1)
            .slice(0, 5)


  res.status(200).json({ suggestions }).end();
});

/**
 * Check if a user is signed in.
 * 
 * @name GET /user/session
 * 
 * @return {Freets[]} - an array of freets created by author
 * @throws {403} - if user is already signed in
 * @throws {400} - if username or password is wrong or not in the 
 *                 correct format
 *
 */
router.get('/session', (req, res) => {
  const currentUser = users.findOneByUserId(req.session.userId);
  const user = currentUser 
                ? utils.constructUserResponse(currentUser, currentUser.userId) 
                : null;

  const suggestions = currentUser 
                      ? utils.getFollowSuggestions(currentUser.userId) 
                      : utils.getFollowSuggestions(null);

  res.status(200).json({ user, suggestions }).end();
});

/**
 * Sign in user.
 * 
 * @name POST /user/session
 * 
 * @return {Freets[]} - an array of freets created by author
 * @throws {403} - if user is already signed in
 * @throws {400} - if username or password is wrong or not in the 
 *                 correct format
 *
 */
router.post(
  '/session', 
  [ 
    validator.isSessionCreated,
    validator.isUsernameSpecialKeyword,
    validator.isValidUsername, 
    validator.isValidPassword,
    validator.isUsernameNotExists
  ], 
  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.filter((user) => {
      return user.username.toLowerCase() === username.toLowerCase() && user.password === password;
    })[0];
    
    if (user) {
      req.session.userId = user.userId;
      const userResponse = utils.constructUserResponse(user, user.userId);
      res.status(201).json({
        message: 'You have logged in successfully',
        user: userResponse
      }).end();
    } else {
      res.status(400).json({
        error: {
          password: 'You have entered an incorrect password'
        }
      }).end();
    }
});

/**
 * Sign out a user
 * 
 * @name DELETE /user/session
 * 
 * @return {User} - an array of freets created by author
 * @throws {403} - if user is not logged in
 *
 */
router.delete('/session', [ validator.isUserLoggedIn ], (req, res) => {
  req.session.userId = undefined;
  res.status(200).send("You have been logged out successfully.");
});


/**
 * Create a user account.
 * 
 * @name POST /user
 * 
 * @param {string} username - username of user 
 * @param {string} password - user's password
 * @return {User} - the created user
 * @throws {403} - if user is already logged in
 * @throws {400} - if username is already taken and when password or username
 *                 is not in correct format
 */
router.post(
  '/', 
  [
    validator.isSessionCreated,
    validator.isUsernameSpecialKeyword,
    validator.isValidUsername, 
    validator.isUsernameAlreadyInUse,
    validator.isValidPassword, 
  ], 
  (req, res) => {
    const user = users.addOne(req.body.username, req.body.password);
    req.session.userId = user.userId;
    const userResponse = utils.constructUserResponse(user, user.userId);
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.username}`, 
      user: userResponse
    }).end();
});

/**
 * Get author details.
 * 
 * @name GET /user/:username
 * 
 * @return {freets: Freets[], author: User} - an object with author details and freets
 * @throws {400} - if author is not a valid username
 *
 */
 router.get('/:username?', [ validator.isUsernameInParamsNotExists ], (req, res) => {
  const author = users.findOneByUsername(req.params.username);
  const authorFreets = freets.getAllFreetsByUserId(author.userId);

  // add private information if requesting user has access
  const includePrivateInfo = utils.addPrivateInformation(req.session.userId, author.userId);
  const authorRefreets = includePrivateInfo ? refreets.getAllRefreetsByUserId(author.userId): [];
  const authorLikes = includePrivateInfo ? likes.getAllLikesByUserId(author.userId) : [];
  const followers = includePrivateInfo ? userRelations.getAllFollowers(author.userId) : [];
  const following = includePrivateInfo ? userRelations.getAllFollowing(author.userId) : [];

  // define a map function for user relatiosn
  const relationsResponseConstructor = (relation) => {
    return utils.constructUserRelationResponse(relation, req.session.userId);
  }

  // create the response
  const response = {
    author: utils.constructUserResponse(author),
    freets: authorFreets.map(utils.constructFreetResponse),
    refreets: authorRefreets.map(refreet => utils.constructRefreetResponse(refreet)),
    likes: authorLikes.map(like => utils.constructLikeResponse(like)),
    followers: followers.map(relationsResponseConstructor),
    following: following.map(relationsResponseConstructor),
    hasPrivateInformation: includePrivateInfo,
    followingStatus: utils.getFollowingStatus(req.session.userId, author.userId),
    followsCurrentUser: utils.isFollowingCurrentUser(req.session.userId, author.userId),
  }; 
  res.status(200).json(response).end();
});

/**
 * Update a user's profile.
 * 
 * @name PUT /user
 * 
 * @param {string} username - the user's new username
 * @param {string} password - the user's new password
 * @param {Boolean} isPrivateAccount - whether the user is setting account to private or not
 * @return {User} - the updated user
 * @throws {403} - if user is not logged in
 * @throws {400} - if username or password are not of the correct format
 */
router.put(
  '/', 
  [ 
    validator.isUserLoggedIn,
    validator.isUsernameSpecialKeyword,
    validator.isValidUsername,
    validator.isUsernameAlreadyInUse,
    validator.isValidPassword
  ], 
  (req, res) => {
    const user = users.updateOne(req.session.userId, req.body);

    // if the user just made account public, accept all pending requests
    if (req.body.isPrivateAccount !== undefined && !req.body.isPrivateAccount) {
      userRelations.acceptAllRequestReceived(req.session.userId);
    }

    const userResponse = utils.constructUserResponse(user, user.userId);
    res.status(200).json({
      message: 'Your profile was updated successfully.', 
      user: userResponse
    }).end();
  });


/**
 * Delete a user.
 * 
 * @name DELETE /user
 * 
 * @return {string} - a success message
 * @throws {403} - if the user is not logged in
 */
router.delete('/', [ validator.isUserLoggedIn ], (req, res) => {

    // delete all the users refreets, likes, followers, following
    likes.removeAllLikesByUserId(req.session.userId);
    refreets.removeAllRefreetsByUserId(req.session.userId);
    userRelations.unfollowAll(req.session.userId);
    userRelations.removeAllFollowers(req.session.userId);

    // get all freets and for each freet, remove all its likes and refreets
    const userFreets = freets.getAllFreetsByUserId(req.session.userId);
    userFreets.forEach(freet => {
      likes.removeAllLikesByFreetId(freet.freetId);
      refreets.removeAllRefreetsByFreetId(freet.freetId);
    })

    // delete all the freets, the user account and reset the session
    freets.removeFreetsByUserId(req.session.userId);
    users.deleteOne(req.session.userId);
    req.session.userId = undefined;

    // send response to client
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    }).end();
});


/**
 * Follow a user or create a follow request
 * 
 * @name POST /user/following
 * 
 * @param {string} username - username of user to follow 
 * @return {UserRelation} - the created user relation
 * @throws {403} - if user is already logged in is trying to follow themselves
 *                 and when user is trying to follow someone they have already followed
 * @throws {400} - if username given is not valid
 */
router.post(
  '/following',
  [
    validator.isUserLoggedIn,
    validator.isSelfRelationOperation,
    validator.isUsernameNotExists,
    validator.isFollowingValid
  ],
  (req, res) => {
    const targetUser = users.findOneByUsername(req.body.username);
    const status = targetUser.isPrivateAccount ? "PENDING" : "ACTIVE";
    const followResponse = userRelations.followOne(req.session.userId, targetUser.userId, status);

    // get response message
    const message = targetUser.isPrivateAccount
                    ? `Follow request to ${targetUser.username} sent`
                    : `You are now following ${targetUser.username}`;
    res.status(201).json({
      message, 
      followResponse: utils.constructUserRelationResponse(followResponse, req.session.userId)
    }).end();
});


/**
 * Remove current user from following given user.
 * 
 * @name DELETE /user/following/:username
 * 
 * @return {string} - a success message
 * @throws {403} - if the user is not logged in, is trying to unfollow themselves
 *                 and when user is trying to unfollow someone they havent followed
 * @throws {400} - If the username given is not valid
 */
router.delete(
  '/following/:username?',
  [
    validator.isUserLoggedIn,
    validator.isSelfRelationOperation,
    validator.isUsernameInParamsNotExists,
    validator.isUnfollowingValid
  ],
  (req, res) => {
    const targetUser = users.findOneByUsername(req.params.username);
    const removedRelation = userRelations.unfollowOne(req.session.userId, targetUser.userId);
    const message = removedRelation.status === "PENDING" 
                    ? `Follow request to ${targetUser.username} cancelled`
                    : `You are nolonger following ${targetUser.username}`
    res.status(200).json({ message }).end();
});


/**
 * Accept a follow request
 * 
 * @name PATCH /user/followers
 * 
 * @param {string} username - username of user whose follow to accept 
 * @return {UserRelation} - the created user relation
 * @throws {403} - if user is already logged in is trying to accept own request
 *                 and when user is trying to accept non existent request
 * @throws {400} - if username given is not valid
 */
router.patch(
  '/followers',
  [
    validator.isUserLoggedIn,
    validator.isSelfRelationOperation,
    validator.isUsernameNotExists,
    validator.isPendingRequestExists,
  ],
  (req, res) => {
    const follower = users.findOneByUsername(req.body.username);
    const updatedRelation = userRelations.acceptFollowRequest(follower.userId, req.session.userId);
    res.status(200).json({
      message: `${follower.username} now follows you`,
      relation: utils.constructUserRelationResponse(updatedRelation, req.session.userId)
    })
});


/**
 * Remove follower or decline follow request.
 * 
 * @name DELETE /user/followers/:username
 * 
 * @param {string} username - username of user to remove
 * @return {string} - a success message
 * @throws {403} - if the user is not logged in, is trying to decline own request,
 *                 when user is trying to remove someone who does not follow them
 *                 or someone who has not sent a follow request to them
 * @throws {400} - If the username given is not valid
 */
router.delete(
  '/followers/:username?',
  [
    validator.isUserLoggedIn,
    validator.isSelfRelationOperation,
    validator.isUsernameInParamsNotExists,
    validator.isRemovingFollowerValid
  ],
  (req, res) => {
    const follower = users.findOneByUsername(req.params.username);
    userRelations.unfollowOne(follower.userId, req.session.userId);
    const message = req.body.isPendingRequest
                    ? `You have declined ${req.params.username} follow request`
                    : `${follower.username} no longer follows you`
    res.status(200).json({ message }).end();
});


/**
 * Mark user notifications as seen
 * 
 * @name PATCH /user/notifications
 * 
 * @param {string} updatedStatus - The new status to update the notifcations with
 * @param {String[]} likeIds - A list of likeIds for notifications to update
 * @param {String[]} refreetIds - A list of refreet ids for notifications to update
 * @param {String[]} acceptedRequestIds - A list of acceptedrequest ids to update
 * @param {String[]} newFollowerIds - A list of new follower notifications to update
 * @return {string} - a success message
 * @throws {403} - if the user is not logged in
 */
router.patch(
  '/notifications',
  [
    validator.isUserLoggedIn
  ],
  (req, res) => {
    const newStatus = req.body.updatedStatus;

    req.body.likeIds 
      && likes.updateLikeNotificationStatus(req.body.likeIds, newStatus);

    req.body.refreetIds 
      && refreets.updateRefreetNotificationStatus(req.body.refreetIds, newStatus);

    req.body.acceptedRequestIds
      && userRelations.updateRelationNotificationStatus(req.body.acceptedRequestIds, newStatus, "followerNotificationStatus");

    req.body.newFollowerIds
      && userRelations.updateRelationNotificationStatus(req.body.newFollowerIds, newStatus, "targetNotificationStatus");
    
    res.status(200).json({ 
      message: "Notifications updated"
    }).end();
}); 

module.exports = router;