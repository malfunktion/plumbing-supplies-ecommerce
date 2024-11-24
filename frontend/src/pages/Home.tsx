import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white rounded-lg p-12 mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Quality Plumbing Supplies for Every Project
        </h1>
        <p className="text-xl mb-8">
          Find everything you need for your plumbing projects, from pipes to fixtures
        </p>
        <Link
          to="/products"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Shop Now
        </Link>
      </div>

      {/* Featured Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {['Pipes', 'Fittings', 'Tools'].map((category) => (
          <div
            key={category}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-4">{category}</h3>
            <Link
              to={`/products?category=${category.toLowerCase()}`}
              className="text-blue-600 hover:text-blue-800"
            >
              View Products →
            </Link>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-50 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
            <p>Top-grade materials and trusted brands</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p>Same-day delivery available</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
            <p>Professional advice when you need it</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
