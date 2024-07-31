const nodemailer = require('nodemailer');
require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: process.env.MAILER_SECURE,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
});

const sendEmail = (to, subject,templateData) => {
    try {
        // Ruta del archivo de plantilla
        const templatePath = path.join(__dirname, 'templates/emailTemplate.ejs');
        // Leer el archivo de plantilla
        const templateStr = fs.readFileSync(templatePath, 'utf8');

        templateData.url = process.env.PORTAL_URL;
        // Renderizar la plantilla con datos
        const html = ejs.render(templateStr, templateData);

        // Configuración del correo electrónico
        const mailOptions = {
            from: process.env.MAILER_FROM,
            to: to,
            subject: subject,
            html: html
        };
        const info = transporter.sendMail(mailOptions);
        return info.response;
    } catch (error) {
        throw error;
    }
};
module.exports = { sendEmail };