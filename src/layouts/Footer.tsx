import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-[#1e3a8a] text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Club Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">East Down Yacht Club</h3>
            <p className="mb-4">
              Sailing on the beautiful waters of Strangford Lough since 1928.
            </p>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="hover:text-[#0284c7] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-[#0284c7] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-[#0284c7] transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-[#0284c7] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#0284c7] transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/club" className="hover:text-[#0284c7] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#0284c7] transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-[#0284c7] transition-colors">
                  Membership
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span>26 Killyleagh Road, Downpatrick, BT30 9DQ</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span>028 4461 2266</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span>info@eastdownyc.co.uk</span>
              </li>
            </ul>
          </div>
          {/* Affiliations */}
          <div>
            <h3 className="text-xl font-bold mb-4">Affiliations</h3>
            <div className="flex flex-col space-y-3">
              <span>RYA Recognized Training Center</span>
              <span>Irish Sailing Association</span>
              <span>Strangford Lough Racing Association</span>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-700 mt-8 pt-6 text-sm text-center">
          <p>
            &copy; {new Date().getFullYear()} East Down Yacht Club. All rights
            reserved.
          </p>
          <p className="mt-1">
            <Link to="#" className="hover:text-[#0284c7] transition-colors">
              Privacy Policy
            </Link>{' '}
            |
            <Link to="#" className="hover:text-[#0284c7] transition-colors ml-2">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;