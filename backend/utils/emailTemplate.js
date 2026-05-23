export const verification_email_template = (verificationCode, name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    .container {
      background: #ffffff;
      max-width: 480px;
      margin: 40px auto;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 10px;
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      color: #1f2937;
      letter-spacing: 3px;
      margin: 16px 0;
    }
    p {
      color: #4b5563;
      font-size: 15px;
    }
    .footer {
      margin-top: 24px;
      font-size: 13px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Asim Mir</div>
    <h2>Email Verification</h2>
    <p>Hi ${name},</p>
    <p>Use the OTP below to verify your email address:</p>
    <div class="otp">${verificationCode}</div>
    <p>This OTP will expire in 10 minutes.</p>
    <p>If you didn’t request this, you can ignore this email.</p>
    <div class="footer">© ${new Date().getFullYear()} YourCompany. All rights reserved.</div>
  </div>
</body>
</html>
`;


export const welcome_email_template = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
    }
    .container {
      background: #ffffff;
      max-width: 520px;
      margin: 40px auto;
      padding: 24px;
      border-radius: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      text-align: center;
    }
    .logo {
      font-size: 26px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 10px;
    }
    h2 {
      color: #111827;
    }
    p {
      color: #374151;
      font-size: 15px;
      line-height: 1.6;
    }
    .cta {
      display: inline-block;
      margin-top: 18px;
      padding: 10px 20px;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Asim Mir</div>
    <h2>Welcome, ${name || "User"} 🎉</h2>
    <p>We’re thrilled to have you on board. Your account has been successfully verified and created.</p>
    <p>Start exploring your dashboard and enjoy our services.</p>
    <a href="https://yourcompany.com/login" class="cta">Go to Dashboard</a>
    <div class="footer">© ${new Date().getFullYear()} YourCompany. All rights reserved.</div>
  </div>
</body>
</html>
`;
