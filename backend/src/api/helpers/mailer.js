const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();

// create a transport object using the SMTP transport and specifying the SMTP host, port, and authentication options
function mail(host, user, pass, msg, from, to, title) {
    const transport = nodemailer.createTransport({
        host: host,
        port: 587,
        secureConnection: false, // use TLS
        auth: {
            user: user,
            pass: pass
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });


    // create the email template
    let html = msg
    // create the email message
    const message = {
        from: from,
        to: to,
        subject: title,
        html: html
    };

    // send the email
    //Have to return a Promise instead of callback
    return new Promise((resolve, reject) => {
        transport.sendMail(message, (error, info) => {
            if (error) {
                reject(error)
            } else {
                resolve(info)
            }
        });
    })

}


async function sendMail(to, title, msg) {
    const host = process.env.MAIL_HOST;
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;
    return mail(host, user, pass, msg, "Collabrain <collabrain@cybertech13.eu.org>", to, title);
}


module.exports = sendMail;