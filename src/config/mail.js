const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: Number(process.env.MAILER_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
    },
});

transporter.verify((error) => {
    if (error) {
        console.error("❌ Mail transporter failed to connect:", error.message);
        console.error(
            "   Check MAILER_HOST, MAILER_PORT, MAILER_USER, MAILER_PASSWORD in .env"
        );
    } else {
        console.log("✅ Mail transporter connected — ready to send emails");
    }
});
const sendMail = transporter.sendMail.bind(transporter);

module.exports = sendMail;
