import { subscribeTOQueue } from "../broker/rabbit.js";
import sendEmail from "../utils/email.js";

function startListner() {
    subscribeTOQueue("user Created", async (msg) => {
        const { email, role, fullName: { firstName, lastName } } = msg;

        const template = `
            <h3>Musify Notification</h3>
            <p>Hello <b>${firstName}</b> <b>${lastName}</b>,</p>
            <p>Welcome to <b>Musify</b>!</p>
            <p>Your role: <b>${role}</b></p>
            <p>Thanks,<br>Musify Team</p>
        `;

        await sendEmail(
            email,
            "Welcome to Musify",
            "Thank you for registering.",
            template
        );
    });
}

export default startListner;
