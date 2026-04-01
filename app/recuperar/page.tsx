import ForgotPasswordForm from './ForgotPasswordForm'

export default function RecuperarPage() {
  return (
    <div className="min-h-screen bg-md-surface flex items-center justify-center">
      <div className="bg-md-surface-container-lowest rounded-md-lg shadow-md-2 p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-xl font-medium text-md-on-surface">Recuperar contraseña</h1>
          <p className="text-md-on-surface-variant text-sm mt-0.5 text-center">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
