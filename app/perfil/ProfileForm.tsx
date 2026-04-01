'use client'

import { useState, useRef } from 'react'

type User = {
  id: number
  email: string
  name: string
  avatarUrl: string | null
  firstName: string | null
  lastName: string | null
  country: string | null
  city: string | null
  nombreNegocio: string | null
  urlNegocio: string | null
  descripcionNegocio: string | null
  categoriaNegocio: string | null
  facebook: string | null
  instagram: string | null
  linkedin: string | null
  twitter: string | null
  youtube: string | null
  objetivo: string | null
}

function Field({ label, name, value, onChange, type = 'text', placeholder }: {
  label: string; name: string; value: string; onChange: (name: string, value: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-md-on-surface-variant mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm bg-md-surface-container-lowest border border-md-outline-variant rounded-md-sm focus:outline-none focus:border-md-primary focus:ring-1 focus:ring-md-primary text-md-on-surface placeholder:text-md-outline"
      />
    </div>
  )
}

function TextArea({ label, name, value, onChange, placeholder }: {
  label: string; name: string; value: string; onChange: (name: string, value: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-md-on-surface-variant mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(name, e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2.5 text-sm bg-md-surface-container-lowest border border-md-outline-variant rounded-md-sm focus:outline-none focus:border-md-primary focus:ring-1 focus:ring-md-primary text-md-on-surface placeholder:text-md-outline resize-none"
      />
    </div>
  )
}

export default function ProfileForm({ user }: { user: User }) {
  const [form, setForm] = useState(() => {
    const f: Record<string, string> = {}
    for (const [k, v] of Object.entries(user)) {
      if (k === 'id') continue
      f[k] = v ?? ''
    }
    return f
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleAvatarUpload(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'thumbnails')
      fd.append('folder', 'avatars')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      setForm(prev => ({ ...prev, avatarUrl: url }))
      // Save immediately
      await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: url }),
      })
      setToast('Foto actualizada')
      setTimeout(() => setToast(null), 3000)
    } catch {
      setToast('Error al subir imagen')
      setTimeout(() => setToast(null), 3000)
    } finally {
      setUploading(false)
    }
  }

  function onChange(name: string, value: string) {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setToast(null)
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setToast(data.error || 'Error al guardar')
      } else {
        setToast('Perfil actualizado')
      }
    } catch {
      setToast('Error de conexión')
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-md-on-surface">Mi Perfil</h1>
        <p className="text-sm text-md-on-surface-variant mt-0.5">Edita tu información personal y profesional</p>
      </div>

      <div className="space-y-8">
        {/* Avatar */}
        <section className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant shadow-md-1 p-6">
          <h2 className="text-sm font-medium text-md-on-surface mb-4">Foto de perfil</h2>
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-md-surface-container flex items-center justify-center shrink-0">
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-md-on-surface-variant">
                  {(form.firstName || form.name || '?').charAt(0).toUpperCase()}
                </span>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleAvatarUpload(file)
                  e.target.value = ''
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="state-layer bg-md-secondary-container text-md-on-secondary-container px-4 py-2 rounded-md-xl text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {uploading ? 'Subiendo...' : form.avatarUrl ? 'Cambiar foto' : 'Subir foto'}
              </button>
              <p className="text-xs text-md-outline mt-1.5">JPG, PNG o WebP. Máx 5MB.</p>
            </div>
          </div>
        </section>

        {/* Personal */}
        <section className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant shadow-md-1 p-6">
          <h2 className="text-sm font-medium text-md-on-surface mb-4">Información personal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre" name="firstName" value={form.firstName} onChange={onChange} placeholder="Tu nombre" />
            <Field label="Apellido" name="lastName" value={form.lastName} onChange={onChange} placeholder="Tu apellido" />
            <Field label="Nombre para mostrar" name="name" value={form.name} onChange={onChange} placeholder="Cómo quieres que te llamen" />
            <Field label="Correo electrónico" name="email" value={form.email} onChange={onChange} type="email" placeholder="tu@email.com" />
            <Field label="País" name="country" value={form.country} onChange={onChange} placeholder="Ej: Colombia" />
            <Field label="Ciudad" name="city" value={form.city} onChange={onChange} placeholder="Ej: Bogotá" />
          </div>
        </section>

        {/* Business */}
        <section className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant shadow-md-1 p-6">
          <h2 className="text-sm font-medium text-md-on-surface mb-4">Perfil de negocio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre del negocio" name="nombreNegocio" value={form.nombreNegocio} onChange={onChange} placeholder="Ej: Mi Empresa S.A.S." />
            <Field label="URL del negocio" name="urlNegocio" value={form.urlNegocio} onChange={onChange} type="url" placeholder="https://tuempresa.com" />
            <Field label="Categoría del negocio" name="categoriaNegocio" value={form.categoriaNegocio} onChange={onChange} placeholder="Ej: E-commerce, SaaS, etc." />
            <div className="sm:col-span-2">
              <TextArea label="Descripción del negocio" name="descripcionNegocio" value={form.descripcionNegocio} onChange={onChange} placeholder="Describe brevemente tu negocio" />
            </div>
          </div>
        </section>

        {/* Objective */}
        <section className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant shadow-md-1 p-6">
          <h2 className="text-sm font-medium text-md-on-surface mb-4">Objetivo</h2>
          <TextArea label="¿Cuál es tu objetivo principal?" name="objetivo" value={form.objetivo} onChange={onChange} placeholder="Describe qué quieres lograr" />
        </section>

        {/* Social */}
        <section className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant shadow-md-1 p-6">
          <h2 className="text-sm font-medium text-md-on-surface mb-4">Redes sociales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Facebook" name="facebook" value={form.facebook} onChange={onChange} type="url" placeholder="https://facebook.com/tu-perfil" />
            <Field label="Instagram" name="instagram" value={form.instagram} onChange={onChange} type="url" placeholder="https://instagram.com/tu-perfil" />
            <Field label="LinkedIn" name="linkedin" value={form.linkedin} onChange={onChange} type="url" placeholder="https://linkedin.com/in/tu-perfil" />
            <Field label="Twitter / X" name="twitter" value={form.twitter} onChange={onChange} type="url" placeholder="https://x.com/tu-perfil" />
            <Field label="YouTube" name="youtube" value={form.youtube} onChange={onChange} type="url" placeholder="https://youtube.com/@tu-canal" />
          </div>
        </section>
      </div>

      {/* Save button */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="state-layer bg-md-primary text-md-on-primary px-6 py-2.5 rounded-md-xl text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
        {toast && (
          <span className={`text-sm font-medium ${toast.includes('Error') || toast.includes('error') ? 'text-md-error' : 'text-md-primary'}`}>
            {toast}
          </span>
        )}
      </div>
    </div>
  )
}
