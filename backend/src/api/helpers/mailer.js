const nodemailer = require('nodemailer');

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
    const host = "smtp.email.uk-london-1.oci.oraclecloud.com";
    const user = "ocid1.user.oc1..aaaaaaaa3ep3ygt2tf4u6uvfsnycknh65fksvqcucn7gb4szoowyj4sfnyva@ocid1.tenancy.oc1..aaaaaaaaji3lwlxyrbygb3tcsp4y3x2wr63zih77el7zs6nb3jypv33vgjya.nd.com";
    const pass = "l.or1kG&}#DxlAHQ#-.!";
    return mail(host, user, pass, msg, "Collabrain <collabrain@cybertech13.eu.org>", to, title);
}


module.exports = sendMail;