import Link from 'next/link'

export const metadata = {
  title: 'Contact Us | Nexify Engine',
  description: 'Get in touch with us',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">Nexify Engine</Link>
          <div className="flex items-center gap-6">
            <Link href="/products" className="text-gray-600 hover:text-primary">Products</Link>
            <Link href="/blog" className="text-gray-600 hover:text-primary">Blog</Link>
            <Link href="/contact" className="font-medium text-primary">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="container-custom section-padding">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" required className="w-full border rounded-lg px-4 py-3" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required className="w-full border rounded-lg px-4 py-3" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" required className="w-full border rounded-lg px-4 py-3" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={6} required className="w-full border rounded-lg px-4 py-3" placeholder="Your message..." />
            </div>
            <button type="submit" className="btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
