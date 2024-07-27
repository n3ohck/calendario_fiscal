const nodemailer = require('nodemailer');
require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
// Configura el transportador de nodemailer
const transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com', // Cambia la región según tu configuración
    port: 587, // Puerto para TLS
    secure: false, // Usa TLS
    auth: {
        user: 'tuemail@ejemplo.com', // Tu dirección de correo de WorkMail
        pass: 'tucontraseña' // Tu contraseña de WorkMail
    }
});

const sendEmail = async (to, subject, templateData) => {
    try {
        // Ruta del archivo de plantilla
        const templatePath = path.join(__dirname, 'templates/emailTemplate.ejs');

        // Leer el archivo de plantilla
        const templateStr = fs.readFileSync(templatePath, 'utf8');

        // Renderizar la plantilla con datos
        const html = ejs.render(templateStr, templateData);

        // Configuración del correo electrónico
        const mailOptions = {
            from: 'tuemail@gmail.com',
            to: to,
            subject: subject,
            html: html
        };

        // Enviar el correo
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Ejemplo de uso
sendEmail('destinatario@example.com', 'Asunto del Correo', { name: 'Juan' });