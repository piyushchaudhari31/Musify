import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Musify <no-reply@musify.app>",
            to,
            subject,
            html,
            text,
        });

        if (error) {
            console.error("Resend Email Error:", error);
        } else {
            console.log("Email sent via Resend:", data);
        }
    } catch (err) {
        console.error("Unexpected Error sending email:", err);
    }
};

export default sendEmail;
