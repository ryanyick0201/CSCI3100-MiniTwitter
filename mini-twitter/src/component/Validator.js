export const emailValidator = email => {
    if (!email) {
      return "Email is required";
    } else if (!new RegExp(/\S+@\S+\.\S+/).test(email)) {
      return "Incorrect email format";
    }
    return "";
  };

  export const optValidator = otp => {
    if (!otp) { //invalid
      return 'OTP is required';
    } else if (/^\d{6}$/.test(otp)) { //valid
      return '';
    } else { //invalid
      return 'The lenght of OTP should be 6 and only 0-9 digit is allowed.';
    }
  }

  export const usernameValidator = username => {
    if (!username) {
      return "Username is required";
    } else if (username.includes("admin")) {
        return "Username cannot include 'admin'";
      } else if (username.length < 4 || username.length > 16) {
        return "Length of Username should be between 4 to 16";
      } 
    return "";
  };
  
  export const passwordValidator = password => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/;
    if (!password) {
        return "Password is required";
    } else if (!regex.test(password)) {
        return "Password should include at least 1 uppercase, 1 lowercase, 1 number and length should be between 8 to 16, and not include any symbols";
    }
        return "";
  };

// export const validatInput =  {
//     let returnMessage = '';
//     //Check empty username and password 
//     if(username == "" || password == "") {  
//         returnMessage += "Username and password cannot be empty!\n";   
//     }  
    
//     //Check minimum and max username length
//     if(username.length < 4 || username.length > 20) {  
//         returnMessage += "Username length must be 4-20 characters!\n";  
//     }  
    
//     //Check minimum and max password length
//     if(password.length < 4 || password.length > 20) {  
//         returnMessage += "Password length must be 4-20 characters!";  
//     }   
//     return returnMessage;
// }