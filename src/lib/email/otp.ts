export function otpTemplate(code: string) {
  const text = `Your OTP is: ${code}`;

  const html = `
    <div style="font-family: Arial; line-height: 1.5;">
      <h2>Your One-Time Password</h2>
      <p style="font-size: 22px; font-weight: bold;">${code}</p>
      <p>This code will expire soon. Do not share it with anyone.</p>
    </div>
  `;

  return { text, html };
}
