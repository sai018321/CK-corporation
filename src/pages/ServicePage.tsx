import React from 'react';
import { motion } from 'motion/react';

interface ServicePageProps {
  data: any;
  type: 'productManagement' | 'procurement' | 'fabrication' | 'logistics';
}

const ServicePage: React.FC<ServicePageProps> = ({ data, type }) => {
  const content = data?.service?.[type];
  const bannerImage = "https://picsum.photos/seed/service-banner/1920/400";

  if (!content) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Service content not found.</p>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Service</h1>
          </div>
        </div>
      </div>

      {/* Sub-nav indicator */}
      <div className="bg-gray-100 border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-tighter">
          <span className={`flex items-center gap-1 ${type === 'productManagement' ? 'text-[#C8102E]' : ''}`}>
            {type === 'productManagement' && <span className="w-1 h-3 bg-[#C8102E]" />}
            Project Management
          </span>
          <span className="text-gray-300">|</span>
          <span className={`flex items-center gap-1 ${type === 'procurement' ? 'text-[#C8102E]' : ''}`}>
            {type === 'procurement' && <span className="w-1 h-3 bg-[#C8102E]" />}
            Procurement
          </span>
          <span className="text-gray-300">|</span>
          <span className={`flex items-center gap-1 ${type === 'fabrication' ? 'text-[#C8102E]' : ''}`}>
            {type === 'fabrication' && <span className="w-1 h-3 bg-[#C8102E]" />}
            Fabrication
          </span>
          <span className="text-gray-300">|</span>
          <span className={`flex items-center gap-1 ${type === 'logistics' ? 'text-[#C8102E]' : ''}`}>
            {type === 'logistics' && <span className="w-1 h-3 bg-[#C8102E]" />}
            Logistics
          </span>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {content?.image && (
                <img 
                  src={content.image} 
                  alt={content.title} 
                  className="rounded-sm shadow-xl w-full"
                  referrerPolicy="no-referrer"
                />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-[#C8102E] pb-2 inline-block">
                {content.title}
              </h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {content.description}
              </div>

              {content.modes && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">We provide procurement services in one the following three modes</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    {content.modes.map((mode: string, idx: number) => (
                      <li key={idx}>{mode}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* List Sections */}
              {content.areas && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-[#C8102E] pl-4">
                    In addition to the discipline engineering and project controls support, we also provide specialist support in the following areas
                  </h3>
                  <div className="grid grid-cols-1 gap-y-2">
                    {content.areas.map((area: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
                        {area}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {content.typicalServices && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-[#C8102E] pl-4">
                    Typical procurement services offered by CK Corp are :
                  </h3>
                  <div className="grid grid-cols-1 gap-y-2">
                    {content.typicalServices.map((service: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {content.capabilities && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-[#C8102E] pl-4">
                    We have the capabilities to present a wide range of fabrication services including but not limited to :
                  </h3>
                  <div className="grid grid-cols-1 gap-y-2">
                    {content.capabilities.map((cap: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
                        {cap}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {content.applications && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-[#C8102E] pl-4">
                    Some of applications are :
                  </h3>
                  <div className="grid grid-cols-1 gap-y-2">
                    {content.applications.map((app: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
                        {app}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
