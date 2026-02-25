import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Printer } from 'lucide-react';

interface FooterProps {
  data: any;
}

const Footer: React.FC<FooterProps> = ({ data }) => {
  return (
    <footer className="bg-[#1a202c] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-gray-700 pb-8">
          {/* About Us Links */}
          <div>
            <h3 className="text-[#C8102E] font-bold mb-4 uppercase text-sm tracking-widest">About Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/about/overview" className="hover:text-white transition-colors">Company Overview</a></li>
              <li><a href="/about/advantages" className="hover:text-white transition-colors">Our Advantages</a></li>
              <li><a href="/about/vision" className="hover:text-white transition-colors">Vision & Mission</a></li>
            </ul>
          </div>

          {/* Service Links */}
          <div>
            <h3 className="text-[#C8102E] font-bold mb-4 uppercase text-sm tracking-widest">Service</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/service/product-management" className="hover:text-white transition-colors">Product Management</a></li>
              <li><a href="/service/procurement" className="hover:text-white transition-colors">Procurement</a></li>
              <li><a href="/service/fabrication" className="hover:text-white transition-colors">Fabrication</a></li>
              <li><a href="/service/logistics" className="hover:text-white transition-colors">Logistics</a></li>
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h3 className="text-[#C8102E] font-bold mb-4 uppercase text-sm tracking-widest">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/contact" className="hover:text-white transition-colors">Contact us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#C8102E] mt-1" />
              <div>
                <p className="text-sm font-semibold">Have any Questions?</p>
                <p className="text-xs text-gray-400">{data.contact.email}</p>
                <p className="text-xs text-gray-400">{data.contact.emailAlt}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#C8102E] mt-1" />
              <div>
                <p className="text-sm font-semibold">Call Us</p>
                <p className="text-xs text-gray-400">Tel : {data.contact.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Printer className="w-5 h-5 text-[#C8102E] mt-1" />
              <div>
                <p className="text-sm font-semibold">Fax</p>
                <p className="text-xs text-gray-400">Fax : {data.contact.fax}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>{data.contact.address}</p>
          <p>{data.footer.copyright}</p>
          <Link to="/admin" className="hover:text-white">login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
