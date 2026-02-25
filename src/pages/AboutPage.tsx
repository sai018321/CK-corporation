import React from 'react';
import { motion } from 'motion/react';

interface AboutPageProps {
  data: any;
  type: 'overview' | 'advantages' | 'vision';
}

const AboutPage: React.FC<AboutPageProps> = ({ data, type }) => {
  const content = data?.about?.[type === 'vision' ? 'vision' : type];
  const bannerImage = "https://picsum.photos/seed/about-banner/1920/400";

  if (!content) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Content not found.</p>
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
            <h1 className="text-3xl font-bold text-white uppercase tracking-wider">About Us</h1>
          </div>
        </div>
      </div>

      {/* Sub-nav indicator */}
      <div className="bg-gray-100 border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 text-xs font-semibold text-gray-500">
          <span className={type === 'overview' ? 'text-[#C8102E]' : ''}>Company Overview</span>
          <span className={type === 'advantages' ? 'text-[#C8102E]' : ''}>Our Advantages</span>
          <span className={type === 'vision' ? 'text-[#C8102E]' : ''}>Vision & Mission</span>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {type !== 'vision' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-[#C8102E] pb-2 inline-block">
                  {content.title}
                </h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {content.content}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {data?.about?.vision?.image && (
                  <img 
                    src={data.about.vision.image} 
                    alt="Vision" 
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
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-[#C8102E] pb-2 inline-block">
                    {data.about.vision.mission.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {data.about.vision.mission.content}
                  </p>
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-[#C8102E] pb-2 inline-block">
                    {data.about.vision.vision.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {data.about.vision.vision.content}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
