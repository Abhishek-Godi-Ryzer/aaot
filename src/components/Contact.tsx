import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
      });
      // Clear notification after 5 seconds
      setTimeout(() => setFormSubmitted(false), 5000);
    }
  };

  return (
    <div className="pt-24 font-sans">
      {/* Hero Section */}
      <section className="bg-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 block">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
            We're Here to Help
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            Have questions or need a personalized demo? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Form and Contact details */}
      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Details Column */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Email
                      </h4>
                      <p className="text-sm font-semibold text-gray-800">info@acot.ai</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Phone
                      </h4>
                      <p className="text-sm font-semibold text-gray-800">+971 4 123 4567</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Address
                      </h4>
                      <p className="text-sm font-semibold text-gray-800">
                        Dubai Silicon Oasis, Dubai, UAE
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Talk to Our Team box */}
              <div className="mt-8 p-6 rounded-2xl bg-gray-50 border border-gray-100/80">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Talk to Our Team</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Have questions or need a demo? Let's talk about how ACOT can empower your Dubai real estate investments.
                </p>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h3>
                
                {formSubmitted && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-800 text-sm font-medium animate-fadeIn">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    Thank you! Your message has been received. Our team will get back to you shortly.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                    >
                      <option>General Inquiry</option>
                      <option>Platform Demo</option>
                      <option>Partnership</option>
                      <option>API & Data Access</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium text-sm px-6 py-3.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all cursor-pointer shadow-sm w-full sm:w-auto"
                  >
                    Send Message
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dubai Office Map Placeholder */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-center text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
            DUBAI HQ OFFICE LOCATION
          </h3>
          <div className="relative h-[280px] bg-white border border-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
            {/* Elegant stylized mock Map representing Dubai Silicon Oasis */}
            <div className="absolute inset-0 bg-linear-to-tr from-gray-50 via-gray-100/50 to-gray-50 p-6 flex flex-col justify-between">
              <div className="space-y-4 opacity-45">
                <div className="h-0.5 bg-gray-300 w-full rounded-full"></div>
                <div className="h-0.5 bg-gray-300 w-2/3 rounded-full"></div>
                <div className="h-0.5 bg-gray-300 w-5/6 rounded-full"></div>
                <div className="h-0.5 bg-gray-300 w-1/2 rounded-full"></div>
              </div>
              <div className="space-y-4 opacity-45 flex flex-col items-end">
                <div className="h-0.5 bg-gray-300 w-1/3 rounded-full"></div>
                <div className="h-0.5 bg-gray-300 w-1/2 rounded-full"></div>
              </div>
            </div>

            <div className="relative text-center z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3 animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">ACOT Headquarters</h4>
              <p className="text-xs text-gray-400">Dubai Silicon Oasis, Dubai, UAE</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
