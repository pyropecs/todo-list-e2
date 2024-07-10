export function validateText(input) {
  //to pass the all validation steps then only it will return true or it will give error message
  if (validateNoEmptyString(input) !== true)
    return validateNoEmptyString(input);
  if (validateOnlyAlphaNumericAndAllowedSpecialCharacters(input) !== true)
    return validateOnlyAlphaNumericAndAllowedSpecialCharacters(input);
  if (validateThereisNoSpecialCharactersOnFirstLetter(input) !== true)
    return validateThereisNoSpecialCharactersOnFirstLetter(input);
  if (validateNotMorThan150Characters(input) !== true)
    return validateNotMorThan150Characters(input);
  if (validateMinimumCharacters(input) !== true)
    return validateMinimumCharacters(input);
  return true;
}

function validateNoEmptyString(text) {
  //to check that there is no empty value in the input
  const textLength = text.length;

  if (textLength === 0) {
    return "Input is required";
  } else {
    return true;
  }
}
function validateThereisNoSpecialCharactersOnFirstLetter(text) {
  //to validate that there is no special characters on the first letter
  const re = /^[a-zA-Z0-9]+[^]*$/; //regular expression for only alphanumeric on the first letter
  if (text.match(re)) {
    return true;
  } else return "First letter should be alphanumeric";
}
function validateNotMorThan150Characters(text) {
  // to check that more than 150 characters is not allowed
  const textLength = text.length;
  if (textLength <= 150) {
    return true;
  } else {
    return "Not more than 150 characters";
  }
}

function validateOnlyAlphaNumericAndAllowedSpecialCharacters(text) {
  //to check that only alphanumeric and special characters , ' - . is allowed
  const alphaNumeric = /^[a-zA-Z0-9\s,@'-.]+$/; //regular expression for matching alphabets and  numbers and allowed special characters

  if (text.match(alphaNumeric)) {
    return true;
  } else {
    return "Only alphanumeric and allowed special characters , ' -";
  }
}
function validateMinimumCharacters(text) {
  //to check that input has more than 10 characters
  const textLength = text.length;
  if (textLength > 3) {
    return true;
  } else return "Must be more than 3 characters";
}
