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

const LOGO_URL = 'https://rdkfjppgbvthvtjdkcgi.supabase.co/storage/v1/object/public/icons/logo-alfred.png'
const FROM = '"Alfred" <alfred@luisbetancourt.co>'

export async function sendMagicLinkEmail(to: string, magicUrl: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Alfred: Enlace de acceso',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${LOGO_URL}" alt="Alfred" style="max-width: 200px;" />
        </div>
        <h2>Enlace de acceso</h2>
        <p>Recibí una solicitud para iniciar sesión en Alfred.</p>
        <p>
          <a href="${magicUrl}" style="display: inline-block; padding: 12px 24px; background: #fcbe49; color: #fff; text-decoration: none; border-radius: 8px;">
            Ingresar a Alfred
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Este enlace expira en 15 minutos. Si no solicitaste este acceso, ignora este correo.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Alfred: Recuperación de contraseña',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${LOGO_URL}" alt="Alfred" style="max-width: 200px;" />
        </div>
        <h2>Recuperar contraseña</h2>
        <p>Recibí una solicitud para restablecer tu contraseña.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #fcbe49; color: #fff; text-decoration: none; border-radius: 8px;">
            Restablecer contraseña
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este correo.</p>
      </div>
    `,
  })
}
