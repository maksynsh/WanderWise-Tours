const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text')
const Transport = require('nodemailer-brevo-transport')

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = `Maksym <${process.env.EMAIL_FROM}>`
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport(new Transport({ apiKey: process.env.EMAIL_BREVO_API_KEY }))
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_NOTIFIER_HOST,
      port: process.env.EMAIL_NOTIFIER_PORT,
      auth: {
        user: process.env.EMAIL_NOTIFIER_USERNAME,
        pass: process.env.EMAIL_NOTIFIER_PASSWORD,
      },
    })
  }

  /**
   * Send the actual Email
   * @param {string} template Template name to render
   * @param {string} subject Subject of the message
   */
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    })

    // 2) Define email options
    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.convert(html),
      html,
    }

    // 3) Create transport and send email
    await this.newTransport().sendMail(emailOptions)
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Wander Tours family')
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Reset password (valid for 10 minutes)')
  }
}
