export function validateText(input){

if(validateNoEmptyString(input) !== true) return validateNoEmptyString(input)
if(validateThereisOnlyOneSpaceAllowed(input) !== true) return validateThereisOnlyOneSpaceAllowed(input)
if(validateNotMorThan150Characters(input)!== true) return validateNotMorThan150Characters(input)
if(validateOnlyAlphaNumeric(input) !== true) return     validateOnlyAlphaNumeric(input)
if(validateMinimum10Characters(input)!==true) return validateMinimum10Characters(input)
return true 
}



function validateNoEmptyString(text){
    const textLength = text.length

    if(textLength === 0){
        return "input is required"
    }else {
        return true
    }

}
function validateThereisOnlyOneSpaceAllowed(text){
    
}
function validateNotMorThan150Characters(text){
    const textLength = text.length ;
    if(textLength <= 150){
        return true
    }else{
        return "not more than 150 characters"
    }


}

function validateOnlyAlphaNumeric(text){
    const alphaNumeric = /^[a-zA-Z0-9]*$/;

    if(alphaNumeric){
        return true
    }else{
        return "only alphanumeric"
    }
}
function validateMinimum10Characters(text){
    const textLength = text.length;
    if(textLength > 10){
        return true
    }else return "must be more than 10 characters"
}




