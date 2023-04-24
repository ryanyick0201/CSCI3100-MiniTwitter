/** sendEmail - Export the sendEmail() function
 * PROGRAMMER: Li, Hang Chi (SID: 1155142983)
 * CALLING SEQUENCE: import forgotPassword From "./component/forgotPassword"
 *                   import the js and call to render this page
 * PURPOSE: Export the sendEmail() function as a moudle and call by other function
 * ALGORITHM:  sendEmail(username) is a function to fetch sendEmail api to send email to input username. If server return success, it means sent email to user with otp already, else it will alert user the error message.
 *
 */

export const sendEmail = (username) => {
  console.log("Send email to username: ", username);

  //Email validation
  if (username) {
    //If ok, call api with email to send
    const api_url = "http://" + window.location.hostname + ":3000/sendEmail?";
    const api_with_params = `${api_url}username=${username}`;

    fetch(api_with_params, {
      method: "GET",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Email sent.") {
          alert("OTP is sended to your email account.");
        } else {
          //Alert user
          alert(data.message);
        }
      })
      .catch((err) => alert(err));
  }
};
