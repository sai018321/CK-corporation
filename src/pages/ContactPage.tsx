import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Printer } from 'lucide-react';

interface ContactPageProps {
  data: any;
}

const ContactPage: React.FC<ContactPageProps> = ({ data }) => {
  const bannerImage = "https://picsum.photos/seed/contact-banner/1920/400";

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={bannerImage} 
          alt="Banner" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Contact</h1>
          </div>
        </div>
      </div>

      {/* Sub-nav indicator */}
      <div className="bg-gray-100 border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 text-xs font-semibold text-gray-500">
          <span className="text-[#C8102E]">Contact</span>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {data?.contact?.image && (
                <img 
                  src={data.contact.image} 
                  alt="Contact" 
                  className="rounded-sm shadow-xl w-full"
                  referrerPolicy="no-referrer"
                />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="flex items-start gap-6">
                <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                  <Mail className="w-10 h-10 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Have any questions?</h3>
                  <p className="text-gray-600">{data.contact.email}</p>
                  <p className="text-gray-600">{data.contact.emailAlt}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                  <Phone className="w-10 h-10 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Call us</h3>
                  <p className="text-gray-600">{data.contact.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                  <Printer className="w-10 h-10 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Fax</h3>
                  <p className="text-gray-600">{data.contact.fax}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
