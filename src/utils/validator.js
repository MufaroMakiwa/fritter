// return true if the length of the input is in the allowed range
function isValidLength(input, min, max) {
  const inputLength = input.length;
  return inputLength >= min && inputLength <= max;
}

// return true if username is a special keyword
function isUsernameSpecialKeyword(input) {
  const specialWords = [
    "user", "login", "home", "register", "password", "notifications", "settings"
  ];
  return specialWords.includes(input);
}

// return true if the input is of length 0
function isEmptyInput(input) {
  return input.length === 0;
}

// return true if the input has white spaces, false otherwise
function hasWhiteSpaces(input) {
  const whiteSpaceRegex = new RegExp("\\s+");
  return whiteSpaceRegex.test(input);
}

// return true if input matches the regex
function isMatchesRegex(input, regex) {
  return regex.test(input);
}

// return true if input starts with a number
function isStartWithDigit(input) {
  return !isNaN(input.charAt(0));
}

/**
 * 
 * @param {String} username - Username entered by the user
 * @returns {String} - An error message assoicated with the input, empty string
 *                     if none
 */
 export function validateUsername(username) {
  // ignore leading and trailing white spaces
  username = username.trim();

  // check if username is empty
  if (isEmptyInput(username)) {
    return "Username cannot be empty";
  }

  // check if username starts with a number
  if (isStartWithDigit(username)) {
    return "Username cannot start with a number";
  }

  // check if username has any white spaces
  if (hasWhiteSpaces(username)) {
    return "Username cannot contain white spaces";
  }

  // check if username is the required length
  if (!isValidLength(username, 6, 50)) {
    return "Username must be 6 - 50 characters long";
  }

  // check if username is not a special keyword
  if (isUsernameSpecialKeyword(username)) {
    return "This is not a valid username"
  }

  // check if username matches regex
  const usernameRegex = new RegExp('^[a-zA-Z0-9]{6,50}$');
  if (!isMatchesRegex(username, usernameRegex)) {
    return "A username must contain only letters and numbers"
  }

  // if there is no error, return empty string
  return "";
  
}

/**
 * 
 * @param {String} password - Password entered by the user
 * @returns {String} - An error message assoicated with the input, empty string
 *                     if none
 */
 export function validatePassword(password) {

  // check if password is empty
  if (isEmptyInput(password)) {
    return "Password cannot be empty";
  }

  // check if password has any white spaces
  if (hasWhiteSpaces(password)) {
    return "Password cannot contain white spaces";
  }

  // check if password is the required length
  if (!isValidLength(password, 6, 50)) {
    return "Password must be 6 - 50 characters long";
  }

  // if there is no error, return empty string
  return "";
}