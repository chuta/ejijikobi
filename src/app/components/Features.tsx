export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold mb-4">Our Signature Style</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the perfect blend of contemporary aesthetics and traditional African craftsmanship
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {['Sustainable Fashion', 'African Heritage', 'Modern Design'].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="h-48 bg-[rgb(200,162,84)]/10 rounded-lg mb-6"></div>
              <h3 className="font-playfair text-xl font-bold mb-2">{feature}</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 