import { Resend } from 'resend';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// ── Gmail API Client (Primary) ──
const gmailClient = (() => {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('⚠ Gmail API credentials not configured. Gmail API will not be available.');
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground"
  );
  
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
})();

// ── Resend Client (Optional Fallback) ──
const resendClient = (() => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('⚠ RESEND_API_KEY not configured. Resend fallback will not be available.');
    return null;
  }
  return new Resend(apiKey);
})();

const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'Bihar Yaatra <noreply@biharyaatra.com>';
const SMTP_FROM = process.env.SMTP_USER || '';

/**
 * Generates a branded HTML email body for OTP verification.
 */
function getOtpEmailHtml(otp: string, name?: string): string {
  const greeting = name ? `Hi ${name},` : 'Hi there,';
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8f9fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8f9fa;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:900;letter-spacing:-1px;">
                <span style="color:#ffffff;">Bihar</span><span style="color:#f97316;">Yaatra</span>
              </h1>
              <p style="margin:8px 0 0;color:#94a3b8;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Email Verification</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:16px;color:#334155;font-weight:600;">${greeting}</p>
              <p style="margin:0 0 28px;font-size:15px;color:#64748b;line-height:1.6;">
                Use the following verification code to complete your action. This code is valid for <strong>10 minutes</strong>.
              </p>
              <!-- OTP Box -->
              <div style="background:linear-gradient(135deg,#fff7ed 0%,#fef3c7 100%);border:2px solid #fed7aa;border-radius:16px;padding:24px;text-align:center;margin:0 0 28px;">
                <p style="margin:0 0 8px;font-size:12px;color:#92400e;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Your Verification Code</p>
                <p style="margin:0;font-size:40px;font-weight:900;letter-spacing:12px;color:#c2410c;font-family:'Courier New',monospace;">${otp}</p>
              </div>
              <p style="margin:0 0 4px;font-size:13px;color:#94a3b8;line-height:1.5;">
                If you didn't request this code, you can safely ignore this email. Someone may have entered your email address by mistake.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #f1f5f9;text-align:center;">
              <p style="margin:0;font-size:12px;color:#cbd5e1;">
                &copy; ${new Date().getFullYear()} BiharYaatra &mdash; Discover the magic of Bihar
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send an OTP email using Gmail API (primary) with Resend as fallback.
 * Throws if both providers fail.
 */
export async function sendOtpEmail(to: string, otp: string, name?: string): Promise<void> {
  const subject = `${otp} is your BiharYaatra verification code`;
  const html = getOtpEmailHtml(otp, name);
  const text = `Your BiharYaatra verification code is: ${otp}. It expires in 10 minutes.`;

  // ── Try Gmail API first ──
  if (gmailClient) {
    try {
      const rawMessage = [
        `From: Bihar Yaatra <${SMTP_FROM}>`,
        `To: ${to}`,
        `Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=utf-8`,
        ``,
        html
      ].join('\r\n');

      const encodedMessage = Buffer.from(rawMessage)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      await gmailClient.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      console.log(`✓ OTP email sent via Gmail API to ${to}`);
      return;
    } catch (apiError: any) {
      console.error(`✗ Gmail API failed for ${to}:`, apiError.message);
      // Fall through to Resend
    }
  }

  // ── Try Resend fallback ──
  if (resendClient) {
    try {
      const { error } = await resendClient.emails.send({
        from: RESEND_FROM,
        to,
        subject,
        text,
        html,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log(`✓ OTP email sent via Resend to ${to}`);
      return;
    } catch (resendError: any) {
      console.error(`✗ Resend failed for ${to}:`, resendError.message);
    }
  }

  // ── Both failed ──
  throw new Error(
    'Failed to send verification email. Neither Gmail API nor Resend is configured/working. ' +
    'Please check your GMAIL_* and RESEND_API_KEY environment variables.'
  );
}

/**
 * Generates a branded HTML email body for password reset.
 */
function getPasswordResetEmailHtml(otp: string, name?: string): string {
  const greeting = name ? `Hi ${name},` : 'Hi there,';
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8f9fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8f9fa;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:900;letter-spacing:-1px;">
                <span style="color:#ffffff;">Bihar</span><span style="color:#f97316;">Yaatra</span>
              </h1>
              <p style="margin:8px 0 0;color:#94a3b8;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Password Reset</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:16px;color:#334155;font-weight:600;">${greeting}</p>
              <p style="margin:0 0 28px;font-size:15px;color:#64748b;line-height:1.6;">
                We received a request to reset your password. Use the verification code below to set up a new password. This code is valid for <strong>10 minutes</strong>.
              </p>
              <!-- OTP Box -->
              <div style="background:linear-gradient(135deg,#fff7ed 0%,#fef3c7 100%);border:2px solid #fed7aa;border-radius:16px;padding:24px;text-align:center;margin:0 0 28px;">
                <p style="margin:0 0 8px;font-size:12px;color:#92400e;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Your Reset Code</p>
                <p style="margin:0;font-size:40px;font-weight:900;letter-spacing:12px;color:#c2410c;font-family:'Courier New',monospace;">${otp}</p>
              </div>
              <p style="margin:0 0 4px;font-size:13px;color:#94a3b8;line-height:1.5;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #f1f5f9;text-align:center;">
              <p style="margin:0;font-size:12px;color:#cbd5e1;">
                &copy; ${new Date().getFullYear()} BiharYaatra &mdash; Discover the magic of Bihar
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send a password reset OTP email.
 */
export async function sendPasswordResetEmail(to: string, otp: string, name?: string): Promise<void> {
  const subject = `${otp} is your BiharYaatra password reset code`;
  const html = getPasswordResetEmailHtml(otp, name);
  const text = `Your BiharYaatra password reset code is: ${otp}. It expires in 10 minutes.`;

  // ── Try Gmail API first ──
  if (gmailClient) {
    try {
      const rawMessage = [
        `From: Bihar Yaatra <${SMTP_FROM}>`,
        `To: ${to}`,
        `Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=utf-8`,
        ``,
        html
      ].join('\r\n');

      const encodedMessage = Buffer.from(rawMessage)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      await gmailClient.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      console.log(`✓ Password reset email sent via Gmail API to ${to}`);
      return;
    } catch (apiError: any) {
      console.error(`✗ Gmail API failed for ${to}:`, apiError.message);
      // Fall through to Resend
    }
  }

  // ── Try Resend fallback ──
  if (resendClient) {
    try {
      const { error } = await resendClient.emails.send({
        from: RESEND_FROM,
        to,
        subject,
        text,
        html,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log(`✓ Password reset email sent via Resend to ${to}`); return;
    } catch (resendError: any) {
      console.error(`✗ Resend failed for ${to}:`, resendError.message);
    }
  }

  // ── Both failed ──
  throw new Error(
    'Failed to send password reset email. Neither Gmail API nor Resend is configured/working. ' +
    'Please check your GMAIL_* and RESEND_API_KEY environment variables.'
  );
}
