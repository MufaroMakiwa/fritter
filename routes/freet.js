const express = require("express");
const router = express.Router();
const freets = require('../models/freets');
const likes = require('../models/likes');
const refreets = require('../models/refreets');
const validator = require('./middleware');
const utils = require('./utilities');

/**
 * Get all the freets
 * 
 * @name GET /freets
 * 
 * @return {Freets[]} - a list of all the freets sorted in descending
 *                      order by date modified
 */
router.get('/', (req, res) => {
  // if user is logged in, get freets and refreets from only the users they follow, 
  // else everyone
  const latestFreets = utils.getFreetsAndRefreetsFromFollowers(req.session.userId);
  const popularFreets = utils.getPopularFreets(req.session.userId);
  res.status(200).json({
    freets: latestFreets,
    popularFreets
  }).end();
})

/**
 * Create a new freet.
 * 
 * @name POST /freets
 * 
 * @param {string} content - the content of the freet
 * @return {Freet} - the created freet
 * @throws {403} - if the user is not logged in
 * @throws {400} - if the freet content is not in the correct format
 */
router.post(
  '/', 
  [ 
    validator.isUserLoggedIn, 
    validator.isValidFreetContent
  ], 
  (req, res) => {
    const freet = freets.addOne(req.session.userId, req.body.content);
    res.status(201).json({
      message: 'Your freet was created successfully.', 
      freet: utils.constructFreetResponse(freet)
    }).end();
});


/**
 * @name DELETE /freets/:id
 * 
 * @return {string} - the deleted freet
 * @throws {403} - if the user is not logged in or is not the author of
 *                 the freet
 * @throws {400} - if the freetId is not valid
 */
router.delete(
  '/:freetId?', 
  [ 
    validator.isUserLoggedIn,
    validator.isValidFreetId,
    validator.isValidFreetModifier
  ],
  (req, res) => {
    // delete all likes and refreets
    likes.removeAllLikesByFreetId(req.params.freetId);
    refreets.removeAllRefreetsByFreetId(req.params.freetId);

    // delete freet and send response to client
    freets.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your freet was deleted successfully.'
    }).end();
});

/**
 * @name PATCH /freets/:id
 * 
 * @param {string} content - the new content for the freet
 * @return {Freet} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of 
 *                 of the freet
 * @throws {400} - if the freet content or freetId is invalid
 */
router.patch(
  '/:freetId?', 
  [ 
    validator.isUserLoggedIn,
    validator.isValidFreetId,
    validator.isValidFreetModifier,
    validator.isValidFreetContent 
  ], 
  (req, res) => {
    // delete all likes and refreets
    likes.removeAllLikesByFreetId(req.params.freetId);
    refreets.removeAllRefreetsByFreetId(req.params.freetId);

    // update the freet and send the update to the client
    const freet = freets.updateOne(req.params.freetId, req.body.content);
    res.status(200).json({
      message: 'Your freet was updated successfully.', 
      freet: utils.constructFreetResponse(freet)
    }).end();
});


/**
 * @name POST /freets/:id/likes
 * 
 * @return {string} - the id of the liking user
 * @throws {403} - if the user is not logged in or not allowed to like the freet
 * @throws {400} - if the freetId is invalid
 */
router.post(
  '/:freetId?/likes',
  [
    validator.isUserLoggedIn,
    validator.isValidFreetId,
    (req, res, next) => validator.checkFreetLikingStatus(req, res, next, false),
  ],
  (req, res) => {
    const authorId = freets.findOne(req.params.freetId).authorId;
    const userId = likes.likeOne(req.params.freetId, req.session.userId, authorId);
    res.status(201).json({
      message: 'Your like was updated successfully.', 
      username: utils.getUsername(userId)
    }).end();
});

/**
 * @name DELETE /freets/:id/likes
 * 
 * @throws {403} - if the user is not logged in or not allowed to dislike the freet
 * @throws {400} - if the freetId is invalid
 */
router.delete(
  '/:freetId?/likes',
  [
    validator.isUserLoggedIn,
    validator.isValidFreetId,
    (req, res, next) => validator.checkFreetLikingStatus(req, res, next, true),
  ],
  (req, res) => {
    likes.dislikeOne(req.params.freetId, req.session.userId);
    res.status(200).json({
      message: 'Your like was removed successfully.'
    }).end();
});


/**
 * @name POST /freets/:id/refreets
 * 
 * @return {Object} - the refreet object
 * @throws {403} - if the user is not logged in or not allowed to refreet the freet
 * @throws {400} - if the freetId is invalid
 */
router.post(
  '/:freetId?/refreets',
  [
    validator.isUserLoggedIn,
    validator.isValidFreetId,
    (req, res, next) => validator.checkFreetRefreetingStatus(req, res, next, false),

  ],
  (req, res) => {
    const authorId = freets.findOne(req.params.freetId).authorId;
    const refreetResponse = refreets.refreetOne(req.params.freetId, req.session.userId, authorId);
    res.status(201).json({
      message: 'Your refreet was updated successfully.', 
      refreet: { 
        username: utils.getUsername(refreetResponse.userId),
        dateAdded: refreetResponse.dateAdded
      }
    }).end();
});


/**
 * @name DELETE /freets/:id/refreets
 * 
 * @throws {403} - if the user is not logged in or not allowed to unrefreet the freet
 * @throws {400} - if the freetId is invalid
 */
router.delete(
  '/:freetId?/refreets',
  [
    validator.isUserLoggedIn,
    validator.isValidFreetId,
    (req, res, next) => validator.checkFreetRefreetingStatus(req, res, next, true),
  ],
  (req, res) => {
    refreets.unrefreetOne(req.params.freetId, req.session.userId);
    res.status(200).json({
      message: 'Your refreet was removed successfully.'
    }).end();
});

module.exports = router;