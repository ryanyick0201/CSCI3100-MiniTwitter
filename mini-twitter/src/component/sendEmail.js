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
