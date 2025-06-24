import dayjs from "dayjs";
import { MailService } from "./mailer.js";

export const mailEventNotification = async (adminId, date) => {
  const mailer = new MailService(adminId);
  await mailer.getAdminEmailAuth(adminId);
  const reciever = mailer.admin?.email;
  const subject = "Event Notification.";
  const htmlContent = `<div style="width:100%;padding:10px;display:flex;
    justify-content:center;flex-direction:column;background:#F8F4E1;color:#4E1F00">
    <div style="font-size:18px;font-weight:600;">SOORAJ CATERERS</div>
    <div style="text-align:center;padding:10px 0;width:100%">
    <img src="cid:logoImage" style="width:100px;height:100px;object-fit:cover;margin:10px auto;" />
    </div>
    <div style="padding:10px 0">This is a notification for an upcoming event on ${dayjs(
      date
    ).format("DD/MM/YYYY")}.</div>
    <div style="text-align:center;padding:20px">Thank you for your attention!</div>
    </div>`;

  const attachments = [
    {
      filename: "logo.png",
      path: "./assets/logo.png",
      cid: "logoImage",
    },
  ];

  return mailer.sendMail(reciever, subject, htmlContent, attachments);
};
