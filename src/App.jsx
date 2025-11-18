import React, { useState } from 'react';
import { Search, ShoppingCart, Gem, Plus, Minus, X } from 'lucide-react';

const App = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const products = [
    // Rings
    { id: 1, category: 'Rings', name: 'Diamond Solitaire Ring', price: 45000, story: 'Timeless elegance with a brilliant-cut diamond set in 18K gold' },
    { id: 2, category: 'Rings', name: 'Emerald Cluster Ring', price: 38000, story: 'Vibrant emeralds surrounded by sparkling diamonds' },
    { id: 3, category: 'Rings', name: 'Ruby Eternity Band', price: 52000, story: 'Continuous row of precious rubies symbolizing eternal love' },
    // Necklaces
    { id: 4, category: 'Necklaces', name: 'Pearl Strand Necklace', price: 28000, story: 'Lustrous freshwater pearls in a classic design' },
    { id: 5, category: 'Necklaces', name: 'Sapphire Pendant', price: 42000, story: 'Deep blue sapphire centerpiece on delicate gold chain' },
    { id: 6, category: 'Necklaces', name: 'Diamond Rivière', price: 95000, story: 'Graduated diamond necklace showcasing exceptional brilliance' },
    // Earrings
    { id: 7, category: 'Earrings', name: 'Diamond Studs', price: 35000, story: 'Classic round brilliant diamonds in platinum settings' },
    { id: 8, category: 'Earrings', name: 'Sapphire Drop Earrings', price: 48000, story: 'Elegant drops featuring Ceylon sapphires and diamonds' },
    { id: 9, category: 'Earrings', name: 'Pearl Hoops', price: 22000, story: 'Modern hoops adorned with cultured pearls' }
  ];

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    mobile: '',
    address1: '',
    address2: '',
    pincode: ''
  });

  const metroPincodes = ['400', '110', '560', '600', '700'];
  
  const calculateShipping = (pincode) => {
    if (!pincode || pincode.length !== 6) return 0;
    const prefix = pincode.substring(0, 3);
    return metroPincodes.includes(prefix) ? 200 : 500;
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = calculateShipping(checkoutForm.pincode);
  const grandTotal = cartTotal + shippingCost;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const displayProducts = selectedCategory === 'All' 
    ? filteredProducts 
    : filteredProducts.filter(p => p.category === selectedCategory);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.mobile || 
        !checkoutForm.address1 || !checkoutForm.address2 || !checkoutForm.pincode) {
      alert('Please fill in all fields!');
      return;
    }
    
    if (checkoutForm.mobile.length !== 10) {
      alert('Mobile number must be 10 digits!');
      return;
    }
    
    if (checkoutForm.pincode.length !== 6) {
      alert('Pin code must be 6 digits!');
      return;
    }
    
    alert(`Order placed successfully!\n\nTotal: ₹${grandTotal.toLocaleString('en-IN')}\n\nThank you for shopping at LUMIÈRE!`);
    setCart([]);
    setShowCheckout(false);
    setCheckoutForm({
      name: '',
      email: '',
      mobile: '',
      address1: '',
      address2: '',
      pincode: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <Gem className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-800">LUMIÈRE</h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex space-x-4 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCart(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  <span className="text-sm text-gray-500 block mb-1">Cart Items</span>
                  Your Cart
                </h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Product Name</p>
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">₹ Price</p>
                          <p className="text-purple-600 font-bold">₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Subtotal:</span>
                      <span className="font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowCart(false);
                        setShowCheckout(true);
                      }}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowCheckout(false)}>
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
                <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Name *</label>
                  <input
                    type="text"
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gmail *</label>
                  <input
                    type="email"
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No. *</label>
                  <input
                    type="tel"
                    value={checkoutForm.mobile}
                    onChange={(e) => setCheckoutForm({...checkoutForm, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                    placeholder="10 digits"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    value={checkoutForm.address1}
                    onChange={(e) => setCheckoutForm({...checkoutForm, address1: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 *</label>
                  <input
                    type="text"
                    value={checkoutForm.address2}
                    onChange={(e) => setCheckoutForm({...checkoutForm, address2: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code *</label>
                  <input
                    type="text"
                    value={checkoutForm.pincode}
                    onChange={(e) => setCheckoutForm({...checkoutForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                    placeholder="6 digits"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? 'Enter pincode' : `₹${shippingCost.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-purple-600">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {checkoutForm.pincode.length === 6 && (
                    <p className="text-sm text-gray-600">
                      Shipping to {metroPincodes.includes(checkoutForm.pincode.substring(0, 3)) ? 'metro city' : 'non-metro area'}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          {selectedCategory === 'All' ? 'All Jewelry' : selectedCategory}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Gem className="w-20 h-20 text-purple-600 opacity-50" />
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-500 mb-1">Product Name</p>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                
                <p className="text-xs text-gray-500 mb-1">₹ Price</p>
                <p className="text-2xl font-bold text-purple-600 mb-4">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
                
                <p className="text-xs text-gray-500 mb-1">Product Story</p>
                <p className="text-gray-600 text-sm mb-4">{product.story}</p>
                
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {displayProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your search.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gem className="w-6 h-6" />
            <span className="text-xl font-bold">LUMIÈRE</span>
          </div>
          <p className="text-gray-400">Exquisite jewelry for every occasion</p>
          <p className="text-gray-500 text-sm mt-4">© 2024 LUMIÈRE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;