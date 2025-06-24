import { MailService } from "./mailer.js";

export const mailPasswordResetLink = async (adminId, reciever, token) => {
  const mailer = new MailService(adminId);
  await mailer.getAdminEmailAuth(adminId);
  const subject = "Sooraj caterers Password Reset.";
  const htmlContent = `<div style="width:100%;padding:10px;display:flex;
    justify-content:center;flex-direction:column;background:#101820;color:#388e3c">
    <div style="font-size:18px;font-weight:600;">GCC MADIKAI</div>
    <div style="padding:10px 0">Click the below link to reset you password. If you didn't request for a password reset, please inform the authorities.</div>
    <div style="text-align:center;padding:20px">Reset Link is :  
    <a href="https://airgead-2-ui.vercel.app/forget-pass?token=${token}" style="color:white;">
    <button style="font-size:20px;border-radius:2px;background:#388e3c;color:#101820;border:none">LINK</button></a>
    </div>
    </div>`;
  return mailer.sendMail(reciever, subject, htmlContent);
};
