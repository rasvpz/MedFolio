var nodemailer = require("nodemailer");
module.exports = {
    sendEmail: (toMail, subject, content) => {
        return new Promise(async (resolve, reject) => {
            var smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "snackydemo@gmail.com",
                    pass: "Ashriya@123",
                },
            });
            var mailOptions = {
                to: toMail,
                from: "snackydemo@gmail.com",
                subject: subject,
                text: "Welcome to  Medimall\n\n" + "hi.\n" + content,
            };

            smtpTransport.sendMail(mailOptions, function (err, info) {
                console.log(err);
                if (err) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    },
};
