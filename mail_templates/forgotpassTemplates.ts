export function getPasswordResetEmailTemplate(otp: string): string {
  return `
  <html>
  <head>
    <style>
      /* Add your custom CSS styles here */
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .headerffffff {
        background-color: #;
        color: #fff;
        padding: 20px 0;
        text-align: center;
      }
      h1 {
        color: #333;
        font-size: 24px;
        margin: 20px 0;
        text-align: center;
      }
      p {
        color: #555;
        font-size: 16px;
        margin-bottom: 20px;
      }
      .otp-box {
        background-color: #007bff;
        color: #fff;
        text-align: center;
        padding: 10px;
        border-radius: 5px;
        font-size: 24px;
      }
      .cta-button {
        text-align: center;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset</h1>
      </div>
      <p>Your OTP for password reset is:</p>
      <div class="otp-box">${otp}</div>
      <p>Please use this OTP to reset your password.</p>
    </div>
  </body>
  </html>
  `;
}
