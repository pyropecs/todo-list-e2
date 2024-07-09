export function validateText(input) {
//to pass the all validation steps then only it will return true or it will give error message

  if (validateNoEmptyString(input) !== true)
    return validateNoEmptyString(input);
  if (validateOnlyAlphaNumeric(input) !== true)
    return validateOnlyAlphaNumeric(input);

  if (validateNotMorThan150Characters(input) !== true)
    return validateNotMorThan150Characters(input);

  if (validateMinimum10Characters(input) !== true)
    return validateMinimum10Characters(input);
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

function validateNotMorThan150Characters(text) {
  // to check that more than 150 characters is not allowed
  const textLength = text.length;
  if (textLength <= 150) {
    return true;
  } else {
    return "Not more than 150 characters";
  }
}

function validateOnlyAlphaNumeric(text) {
//to check that only alphanumeric and special characters , ' - . is allowed
  const alphaNumeric = /^[a-zA-Z0-9\s,'-.]+$/;

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
