// ===================== Envío de mails =====================
// Si está instalado nodemailer (npm i nodemailer) y configuradas las variables
// SMTP_HOST, SMTP_PORT, SMTP_USER y SMTP_PASS, se manda un mail real.
// Si no, el contenido se muestra en la consola del servidor (modo desarrollo),
// así se pueden probar los códigos y links sin configurar nada.

let transporter = null;

try {
    const nodemailer = require('nodemailer');
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
    }
} catch {
    // nodemailer no está instalado: se usa la consola
}

const sendMail = async ({ to, subject, text }) => {
    if (transporter) {
        await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text });
        return;
    }

    console.log('\n================ MAIL (modo desarrollo) ================');
    console.log(`Para: ${to}`);
    console.log(`Asunto: ${subject}`);
    console.log(text);
    console.log('========================================================\n');
};

module.exports = { sendMail };
