export function validateText(input) {
  if (validateNoEmptyString(input) !== true)
    return validateNoEmptyString(input);
  if (validateThereisOnlyOneSpaceAllowedBetweenWords(input) !== true)
    return validateThereisOnlyOneSpaceAllowedBetweenWords(input);
  if (validateNotMorThan150Characters(input) !== true)
    return validateNotMorThan150Characters(input);
  if (validateOnlyAlphaNumeric(input) !== true)
    return validateOnlyAlphaNumeric(input);
  if (validateMinimum10Characters(input) !== true)
    return validateMinimum10Characters(input);
  return true;
}

function validateNoEmptyString(text) {
  const textLength = text.length;

  if (textLength === 0) {
    return "input is required";
  } else {
    return true;
  }
}
function validateThereisOnlyOneSpaceAllowedBetweenWords(text) {
  const re = /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/;
  const isValidText = text.match(re);
  if (isValidText) {
    return true;
  } else {
    return "there is only one space is allowed";
  }
}
function validateNotMorThan150Characters(text) {
  const textLength = text.length;
  if (textLength <= 150) {
    return true;
  } else {
    return "not more than 150 characters";
  }
}

function validateOnlyAlphaNumeric(text) {
  const alphaNumeric = /^[a-zA-Z0-9 ]+$/;

  if (text.match(alphaNumeric)) {
    return true;
  } else {
    return "only alphanumeric";
  }
}
function validateMinimum10Characters(text) {
  const textLength = text.length;
  if (textLength > 10) {
    return true;
  } else return "must be more than 10 characters";
}
