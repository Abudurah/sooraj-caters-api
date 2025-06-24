import nodemailer from "nodemailer";
import { Users } from "../../models/Users.js";

export class MailService {
  constructor() {
    this.transporter = null;
  }

  async getAdminEmailAuth(adminId) {
    try {
      this.admin = await Users.findOne({ _id: adminId?.toString() });
      this.emailSmtp = this.admin?.emailSmtp;
      this.emailPort = this.admin?.emailPort;
      this.userAuth = {
        user: this.admin?.email,
        pass: this.admin?.mailPassword,
      };

      this.transporter = nodemailer.createTransport({
        host: this.emailSmtp || "smtp.gmail.com",
        port: this.emailPort || 587,
        secure: false,
        auth: this.userAuth,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async sendMail(users, subject, html, attatchments = []) {
    let status = await this.transporter
      .sendMail({
        from: this.userAuth?.user,
        to: users,
        subject: subject,
        html: html,
        attachments: attatchments,
      })
      .then(() => true)
      .catch((err) => err);

    return status;
  }
}
