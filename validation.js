export function validateText(input) {
  if (validateNoEmptyString(input) !== true)
    return validateNoEmptyString(input);
  if (validateOnlyAlphaNumeric(input) !== true)
    return validateOnlyAlphaNumeric(input);
  if (validateFirstLetterThereisNoSpecialCharacters(input))
    return validateFirstLetterThereisNoSpecialCharacters(input);
  if (validateNotMorThan150Characters(input) !== true)
    return validateNotMorThan150Characters(input);

  if (validateMinimum10Characters(input) !== true)
    return validateMinimum10Characters(input);
  return true;
}

function validateNoEmptyString(text) {
  const textLength = text.length;

  if (textLength === 0) {
    return "Input is required";
  } else {
    return true;
  }
}

function validateNotMorThan150Characters(text) {
  const textLength = text.length;
  if (textLength <= 150) {
    return true;
  } else {
    return "Not more than 150 characters";
  }
}
function validateFirstLetterThereisNoSpecialCharacters(text) {
  const re = /^[a-zA-Z][a-zA-Z0-9 \-,]+$/;
  if (text.match(re)) {
    return "first character only alphabets";
  } else {
    return true;
  }
}

function validateOnlyAlphaNumeric(text) {
  const alphaNumeric = /^[a-zA-Z0-9\s,'-]+$/;

  if (text.match(alphaNumeric)) {
    return true;
  } else {
    return "Only alphanumeric and allowed special characters , ' -";
  }
}
function validateMinimum10Characters(text) {
  const textLength = text.length;
  if (textLength > 10) {
    return true;
  } else return "Must be more than 10 characters";
}
