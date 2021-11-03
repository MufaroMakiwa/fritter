const freets = require('../models/freets');
const users = require('../models/users');
const likes = require('../models/likes');
const refreets = require('../models/refreets');
const userRelations = require('../models/user-relations');



// checks if the session user (if any) still exists in the database, for instance, a user may
// try to log out in another browser while the account has been deleted in another or
// when a user tries to modify an account in another browser while it has been deleted 
// in another
const isCurrentSessionUserExists = (req, res, next) => {
  if (req.session.userId !== undefined && users.findOneByUserId(req.session.userId) === undefined ) {
    req.session.userId = undefined;
    res.status(401).json({
      error: {
        userNotFound: "This user no longer exists"
      }
    }).end();
    return;
  }
  next()
}


// checks if a username is the same as a special name like a route on the client side
const isUsernameSpecialKeyword = (req, res, next) => {
  const specialWords = [
    "user", "login", "home", "register", "password", "notifications", "settings"
  ];

  if (req.body.username !== undefined && specialWords.includes(req.body.username)) {
    res.status(400).json({
      error: {
        username: 'This is not a invalid username'
      },
    }).end();
    return;
  }
  next();
}


// checks if a username is valid, that is, it matches the username regex
const isValidUsername = (req, res, next) => {
  const usernameRegex = new RegExp('^(?=[a-zA-Z0-9]{6,50}$)(?![\\d])');
  if (req.body.username !== undefined && !usernameRegex.test(req.body.username)) {
    res.status(400).json({
      error: {
        username: 'A username must be 6 - 50 alphanumeric characters without any spaces and cannot start with a number'
      },
    }).end();
    return;
  }
  next();
}


// check if the password is valid, i.e at least 6 characters long
const isValidPassword = (req, res, next) => {
  const passwordRegex = new RegExp('^[^\\s]{6,50}$');
  if (req.body.password !== undefined && !passwordRegex.test(req.body.password)) {
    res.status(400).json({
      error: {
        password: "A password must be 6 - 50 characters without any spaces"
      },
    }).end();
    return;
  }
  next();
}


// Checks if the username exists in the sign in request
const isUsernameNotExists = (req, res, next) => {
  if (req.body.username !== undefined && users.findOneByUsername(req.body.username) === undefined) {
    res.status(400).json({
      error: {
        username: "There is no account associated with this username"
      },
    }).end();
    return;
  }  
  next();
}


// checks if user exists by username
const isUsernameInParamsNotExists = (req, res, next) => {
  if (!req.params.username) {
    res.status(400).json({
      error: {
        username: 'You have not provided the name of the author'
      },
    }).end();
    return;
  }
  if (users.findOneByUsername(req.params.username) === undefined) {
    res.status(400).json({
      error: {
        username: `A user with username, ${req.params.username}, does not exist`
      },
    }).end();
    return;
  }  
  next();
}


// Checks if a username is already in use. Since our validation is case insensitive, it means
// if the current session user wants to change their username to another one which matches
// their current one irrespective of the case, we should allow them to do so
const isUsernameAlreadyInUse = (req, res, next) => {
  if (req.body.username !== undefined) {
    const user = users.findOneByUsername(req.body.username);
    if (user !== undefined) {
      let hasError = true;
      if (req.session.userId !== undefined && user.userId === req.session.userId) {
        hasError = false;
      }

      if (hasError) {
        res.status(403).json({
          error: {
            username: 'An account with this username already exists'
          },
        }).end();
        return;
      }   
    }
  }
  next();
}


// Checks that the userId is set in session, i.e, user logged in
const isUserLoggedIn = (req, res, next) => {
  if (req.session.userId === undefined) {
    res.status(403).json({
      error: {
        auth: 'You must be logged in inorder to do this operation'
      }
    }).end();
    return;
  }
  next();
};


// Checks that the user is already signed in or not
const isSessionCreated = (req, res, next) => {
  if (req.session.userId !== undefined) {
    res.status(403).json({
      error: 'You are already signed in.'
    }).end();
    return;
  }
  next();
};


// Checks if a freet ID is valid or not
const isValidFreetId = (req, res, next) => {
  if (freets.findOne(req.params.freetId) === undefined ) {
    res.status(400).json({
      error: {
        freetNotFound: `A freet with freetId, ${req.params.freetId}, does not exist`
      },
    }).end();
    return;
  }
  next();
}


// Checks if the content of the tweet is valid, i.e not a stream of empty
// spaces and not more than 140 characters
const isValidFreetContent = (req, res, next) => {
  const content = req.body.content;
  const emptyFreetRegex = new RegExp('^\\s+$');

  if (emptyFreetRegex.test(content)) {
    res.status(400).json({
      error: 'A freet must not contain only white spaces',
    }).end();
    return;
  }

  if (content.length > 140 || content.length < 1) {
    res.status(400).json({
      error: `A freet must be 1 - 140 characters. Current length: ${content.length} characters`,
    }).end();
    return;
  }
  next();
}


// check if a user is trying to update a freet they created
const isValidFreetModifier = (req, res, next) => {
  const userId = freets.findOne(req.params.freetId).authorId;
  if (req.session.userId !== userId) {
    res.status(403).json({
      error: "You cannot edit this freet because you are not its author"
    }).end();
    return;
  }
  next();
}


// check if a user is allowed to like a freet or not
const checkFreetLikingStatus = (req, res, next, expected) => {
  const like = likes.findOne(req.params.freetId, req.session.userId);
  const isLiking = (like !== undefined);

  // if expected is true, the user is expected to be liking, false otherwise
  if (!expected && isLiking) {
    res.status(403).json({
      error: {
        ignoreError: "You cannot like this freet because you liked it already"
      }
    }).end();
    return;
  }

  if (expected && !isLiking) {
    res.status(403).json({
      error: {
        ignoreError: "You cannot dislike this freet because you have not liked it"
      }
    }).end();
    return;
  }
  next();
}

// check if a user is allowed to refreet a freet
const checkFreetRefreetingStatus = (req, res, next, expected) => {
  const refreet = refreets.findOne(req.params.freetId, req.session.userId);
  const isRefreeting = (refreet !== undefined);

  // if expected is true, the user is expected to be refreeting, false otherwise
  if (!expected && isRefreeting) {
    res.status(403).json({
      error: {
        ignoreError: "You cannot refreet this freet because you refreeted it already"
      }
    }).end();
    return;
  }

  if (expected && !isRefreeting) {
    res.status(403).json({
      error: {
        ignoreError: "You cannot unrefreet this freet because you have not refreeted it"
      }
    }).end();
    return;
  }
  next();
}

// check if the current user is trying to add / update / delete a self
// relation, i.e, following themselves etc
const isSelfRelationOperation = (req, res, next) => {
  const currentUser = users.findOneByUserId(req.session.userId);
  if (req.body.username !== undefined && req.body.username === currentUser.username ||
      req.params.username !== undefined && req.body.username === currentUser.username) {   
    res.status(403).json({
      error: {
        relationError: "You cannot follow or unfollow yourself"
      }
    }).end();
    return;
  }
  next();
}


// check if a user is allowed to follow another user
const isFollowingValid = (req, res, next) => {
  const targetUser = users.findOneByUsername(req.body.username); 
  const relation = userRelations.findOne(req.session.userId, targetUser.userId);
  if (relation !== undefined) {
    const message = relation.status === "ACTIVE"
                    ? "You cannot follow someone you have already followed"
                    : `You have already sent a follow request to ${targetUser.username}`

    res.status(403).json({
      error: {
        ignoreError: {
          message: message,
          status: relation.status
        }
      }
    }).end();
    return;
  }
  next();
}


// check if a user is not allowed to follow another user
const isUnfollowingValid = (req, res, next) => {
  const targetUser = users.findOneByUsername(req.params.username); 
  const relation = userRelations.findOne(req.session.userId, targetUser.userId);

  if (relation === undefined) {
    const message = req.body.isPendingRequest
                    ? "The follow request no longer exists"
                    : "You cannot unfollow someone you are not following"
    res.status(403).json({
      error: {
        ignoreError: message
      }
    }).end();
    return;
  }

  // if the follow request has already been accepted
  if (req.body.isPendingRequest && relation.status === "ACTIVE") {
    res.status(403).json({
      error: {
        relationError: "This follow request has already been accepted."
      }
    }).end();
    return;
  }
  next();
}


// checks if a pending request exists before accepted
const isPendingRequestExists = (req, res, next) => {
  const follower = users.findOneByUsername(req.body.username);
  const relation = userRelations.findOne(follower.userId, req.session.userId);
  if (relation === undefined) {
    res.status(403).json({
      error: {
        relationError: "This follow request no longer exists."
      }
    }).end();
    return;
  }
  // if the relation is active already, no need to raise any errors
  next();
}

// check if it is possible to delete the follower request or delete a user from
// following current session user
const isRemovingFollowerValid = (req, res, next) => {
  const follower = users.findOneByUsername(req.params.username);
  const relation = userRelations.findOne(follower.userId, req.session.userId);

  // declining a request that no longer exists or deleting a follower
  if (relation === undefined) {

    if (req.body.isPendingRequest) {
      res.status(403).json({
        error: {
          ignoreError: "This follow request no longer exists"
        }
      }).end();
      
    // deleting a follower who no longer exists
    } else {
      res.status(403).json({ 
        error: {
          ignoreError: `${follower.username} no longer follows you`
        }
      }).end();
    }
    return;
  }

  // declining a request that has been accepted already
  if (req.body.isPendingRequest && relation.status === "ACTIVE") {
    res.status(403).json({
      error: {
        relationError: "This follow request has already been accepted."
      }
    }).end();
    return;
  }
  next();
}


module.exports = Object.freeze({
  isCurrentSessionUserExists,
  isUserLoggedIn,
  isSessionCreated,
  isUsernameAlreadyInUse,
  isUsernameSpecialKeyword,
  isUsernameNotExists,
  isUsernameInParamsNotExists,
  isValidFreetContent,
  isValidUsername,
  isValidPassword,
  isValidFreetId,
  isValidFreetModifier,
  isSelfRelationOperation,
  checkFreetLikingStatus,
  checkFreetRefreetingStatus,
  isFollowingValid,
  isUnfollowingValid,
  isPendingRequestExists,
  isRemovingFollowerValid
});