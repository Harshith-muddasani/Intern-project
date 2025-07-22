import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">MiAltar</h3>
            <p className="text-gray-500 text-sm">Create, customize, and save your own digital altar experience.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-500 hover:text-gray-800">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-800">Blog</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-800">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-4">Stay up to date with our latest news and offerings.</p>
            <form className="flex">
              <input type="email" placeholder="Enter your email" className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-accent focus:border-accent" />
              <button type="submit" className="bg-accent text-white px-4 py-2 rounded-r-md hover:bg-accent-hover">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MiAltar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 