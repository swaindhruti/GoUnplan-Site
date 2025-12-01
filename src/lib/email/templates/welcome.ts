export function welcomeTemplate(name: string) {
  const text = `Hi ${name}, welcome to our platform!`;

  const html = `
    <div style="font-family: Arial; line-height: 1.5;">
      <h2>Hello ${name},</h2>
      <p>Welcome to our platform. We’re excited to have you.</p>
    </div>
  `;

  return { text, html };
}
