function validateEmail(email){
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validatePassword(password){
    var pw = /(?=.*[A-Z])+(?=.*[0-9]).{5,}/
    return pw.test(password);
}

module.exports.validateEmail = validateEmail;
module.exports.validatePassword = validatePassword;