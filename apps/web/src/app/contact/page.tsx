import type { Metadata } from 'next'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Nexify Engine team.',
}

export default function ContactPage() {
  return (
    <div className="container-custom section-padding">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold">Get in touch</h1>
          <p className="mt-3 text-gray-600">
            Questions, feedback, partnerships — we&apos;d love to hear from you.
          </p>
        </header>
        <ContactForm />
      </div>
    </div>
  )
}
