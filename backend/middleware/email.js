const {
  verification_email_template,
  welcome_email_template,
} = require("../utils/emailTemplate");
const { transporter } = require("../config/email.config");

const sendVerificatioCode = async (email, name, verificationCode) => {
    try {
        const info = await transporter.sendMail({
            from: '"Asim Mir" <asimqamarasim156@gmail.com>',
            subject: 'Email Verification',
            to: email,
            html: verification_email_template(verificationCode, name)
        })
        console.log('Email Send')
    } catch (error) {
        console.log(error)
    }
}
const WelcomeEmail = async (email, name) => {
    try {
        const info = await transporter.sendMail({
            from: '"Asim Mir" <asimqamarasim156@gmail.com>',
            subject: 'Welcome',
            to: email,
            html: welcome_email_template(name)
        })
        console.log('Email Send')
    } catch (error) {
        console.log(error)
    }
}


module.exports = { sendVerificatioCode, WelcomeEmail }