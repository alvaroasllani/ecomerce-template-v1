import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-8 text-center">About Tech Accessories</h1>
        
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Tech Accessories was founded with a simple mission: to provide high-quality, premium tech 
            accessories that enhance your workspace and boost productivity. We believe 
            that technology should be both functional and beautiful.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Every product in our collection is carefully curated and tested to ensure it meets 
            our high standards for quality, design, and functionality. We work directly with 
            top manufacturers to bring you the best products at fair prices.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-700">
                We never compromise on quality. Every product is thoroughly tested before 
                making it to our store.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Minimalist Design</h3>
              <p className="text-gray-700">
                We believe in the power of simplicity. Our products feature clean, timeless 
                designs that never go out of style.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Satisfaction</h3>
              <p className="text-gray-700">
                Your satisfaction is our priority. We offer hassle-free returns and 
                responsive customer support.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            Have questions? We'd love to hear from you. Reach out to our team:
          </p>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> hello@techaccessories.com
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span> (555) 123-4567
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Hours:</span> Monday - Friday, 9am - 6pm EST
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

