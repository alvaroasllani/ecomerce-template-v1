import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="text-lg font-bold text-gray-900">Tech Accessories</span>
            </div>
            <p className="text-sm text-gray-600">
              Premium accessories for your modern workspace.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/products?category=keyboards" className="hover:text-gray-900 transition-colors">Keyboards</Link></li>
              <li><Link href="/products?category=mice" className="hover:text-gray-900 transition-colors">Mice</Link></li>
              <li><Link href="/products?category=desk-mats" className="hover:text-gray-900 transition-colors">Desk Mats</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
              <li><Link href="/shipping" className="hover:text-gray-900 transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/faq" className="hover:text-gray-900 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-gray-900 transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-gray-900 transition-colors">Careers</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          © 2024 Tech Accessories. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
