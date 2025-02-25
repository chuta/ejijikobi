export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <div className="bg-black text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-center mb-4">
            Contact Us
          </h1>
          <p className="text-gray-300 text-center max-w-2xl mx-auto">
            Get in touch with us for any inquiries about our products or services.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-playfair font-bold mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <p className="flex items-center text-gray-600">
                <span className="font-semibold w-24">Address:</span>
                Lagos, Nigeria
              </p>
              <p className="flex items-center text-gray-600">
                <span className="font-semibold w-24">Email:</span>
                info@ejijikobi.com
              </p>
              <p className="flex items-center text-gray-600">
                <span className="font-semibold w-24">Phone:</span>
                +234 XXX XXX XXXX
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-playfair font-bold mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white px-8 py-3 rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 