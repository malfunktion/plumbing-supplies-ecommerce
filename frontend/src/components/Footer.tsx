import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Plumbing Supplies</h3>
            <p className="text-gray-400">
              Quality plumbing supplies for professionals and DIY enthusiasts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products?category=pipes"
                  className="text-gray-400 hover:text-white"
                >
                  Pipes
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=fittings"
                  className="text-gray-400 hover:text-white"
                >
                  Fittings
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=tools"
                  className="text-gray-400 hover:text-white"
                >
                  Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@plumbingsupplies.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Plumber Street</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Plumbing Supplies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
