/** validator - list of validator to export
 * PROGRAMMER: Li, Hang Chi (SID: 1155142983)
 * CALLING SEQUENCE: import usernmaeValidator From "./component/validator"
 *                   import passwordValidator From "./component/validator"
 *                   import optValidator From "./component/validator"
 *                   import usernameloginValidator From "./component/validator"
 *                   import emailValidator From "./component/validator"
 *                   import the js and call to render this page
 * PURPOSE: Provide a list of validators to import.
 * ALGORITHM: emailValidator(email) is a function to check the email format
 *            optValidator(otp) is a function to check the otp format, should be 6 digits and only 0-9
 *            usernameloginValidator(username) is a function to for login page to check the username with lenght 4 to 16
 *            usernameValidator(username) is a function to check the username should not include "admin" and the lenth should between 4 to 16.
 *            passwordValidator(password) is a function to check the password should be include at least 1 uppercase, 1 lowercase, 1 number and length should be between 8 to 16, and not include any symbols.
 *
 */

export const emailValidator = (email) => {
  if (!email) {
    return "Email is required";
  } else if (!new RegExp(/\S+@\S+\.\S+/).test(email)) {
    return "Incorrect email format";
  }
  return "";
};

export const optValidator = (otp) => {
  if (!otp) {
    //invalid
    return "OTP is required";
  } else if (/^\d{6}$/.test(otp)) {
    //valid
    return "";
  } else {
    //invalid
    return "The lenght of OTP should be 6 and only 0-9 digit is allowed.";
  }
};

export const usernameloginValidator = (username) => {
  if (!username) {
    return "Username is required.\n";
  } else if (username.length < 4 || username.length > 16) {
    return "Length of Username should be between 4 to 16.\n";
  }
  return "";
};

export const usernameValidator = (username) => {
  if (!username) {
    return "Username is required.\n";
  } else if (username.includes("admin")) {
    return "Username cannot include 'admin'.\n";
  } else if (username.length < 4 || username.length > 16) {
    return "Length of Username should be between 4 to 16.\n";
  }
  return "";
};

export const passwordValidator = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/;
  if (!password) {
    return "Password is required.\n";
  } else if (!regex.test(password)) {
    return "Password should include at least 1 uppercase, 1 lowercase, 1 number and length should be between 8 to 16, and not include any symbols.\n";
  }
  return "";
};
