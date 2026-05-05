'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      onSubmit={async (event) => {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        setStatus('submitting')
        setError(null)
        try {
          // In production this should POST to a real handler. For now, we
          // simulate a successful submission so the UI is fully functional.
          await new Promise((resolve) => setTimeout(resolve, 600))
          // eslint-disable-next-line no-console
          console.info('contact form submitted', Object.fromEntries(formData.entries()))
          setStatus('success')
          form.reset()
        } catch (err) {
          setStatus('error')
          setError(err instanceof Error ? err.message : 'Something went wrong')
        }
      }}
    >
      {status === 'success' && (
        <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Thanks — your message has been received. We&apos;ll be in touch soon.
        </div>
      )}
      {status === 'error' && error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input id="contact-name" name="name" label="Name" autoComplete="name" required />
        <Input id="contact-email" name="email" type="email" label="Email" autoComplete="email" required />
      </div>
      <Input id="contact-subject" name="subject" label="Subject" required />
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-gray-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="How can we help?"
        />
      </div>
      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name: string
  label: string
}

function Input({ id, label, required, ...rest }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        required={required}
        {...rest}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}
