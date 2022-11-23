const nodemailer = require('nodemailer')
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const template = './template/requestResetPassword.handlebars'

const source = fs.readFileSync(path.join(__dirname, template), "utf8");
const compiledTemplate = handlebars.compile(source);

const client = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "naveenkumar00004444@gmail.com",
        pass: "hvuenbywbazktkwm"
    },
    host: 'smtp.gmail.com',
    post: 465
});

function sendMail(email, link) {

    const payload = {
        name: email,
        link: link,
    }

    client.sendMail(
        {
            from: "naveenkumar00004444@gmail.com",
            to: "kiyeb64047@turuma.com",
            subject: "Reset Password",
            html: compiledTemplate(payload),
        }, (err) => {
            if (err) {
                return console.log(err);
            }
            return console.log("Success");
        }
    )
}

module.exports = {
    sendMail
}


