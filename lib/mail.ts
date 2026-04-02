import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await transporter.sendMail({
    from: `"Alfred" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Recuperar contraseña — Alfred',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://rdkfjppgbvthvtjdkcgi.supabase.co/storage/v1/object/public/icons/logo-alfred.png" alt="Alfred" style="max-width: 200px;" />
        </div>
        <h2>Recuperar contraseña</h2>
        <p>Recibí una solicitud para restablecer tu contraseña.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #6750A4; color: #fff; text-decoration: none; border-radius: 8px;">
            Restablecer contraseña
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este correo.</p>
      </div>
    `,
  })
}
