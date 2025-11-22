import { subscribeTOQueue } from "../broker/rabbit.js";
import sendEmail from "../utils/email.js";

function startListner() {
  subscribeTOQueue("user Created", async (msg) => {
    const { email, role, fullName: { firstName, lastName } } = msg;

    const template = `
        <h3>Musify Notification</h3>
    <p>Hello <b>${firstName}</b> <b>${lastName}</b></p>
    <p>We’re excited to have you as part of <b>Musify</b>!</p>
    <p>Your details are as follows:</p>

    <p>
      First Name: <b>${firstName}</b><br>
      Last Name: <b>${lastName}</b><br>
      Role: <b>${role}</b>
    </p>

    <p>Thank you for being with us,<br>
    — The Musify Team</p>`;

    await sendEmail(
      email,
      "Welcome to Musify",
      "You have successfully registered.",
      template
    );
  });
}

export default startListner;


