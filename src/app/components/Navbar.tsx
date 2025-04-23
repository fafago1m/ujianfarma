"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-700">Farma Test</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
            <Link href="/post" className="text-gray-700 hover:text-indigo-600 font-medium">Post</Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-indigo-600">
              <FiSearch className="h-5 w-5" />
            </button>

            <button 
              className="md:hidden text-gray-700 hover:text-indigo-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden bg-white py-4 px-2 shadow-lg rounded-lg mt-2">
            <Link href="/" className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 rounded">Home</Link>
            <Link href="/product" className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 rounded">Books</Link>
            <Link href="/about" className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 rounded">About</Link>
            <Link href="/contact" className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 rounded">Contact</Link>
          </div>
        )}
      </div>
    </nav>
  );
}