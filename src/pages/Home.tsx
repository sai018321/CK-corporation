import React from 'react';
import { motion } from 'motion/react';

interface HomeProps {
  data: any;
}

const Home: React.FC<HomeProps> = ({ data }) => {
  if (data?.home?.blocks) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap">
            {data.home.blocks.map((block: any) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  marginTop: block.styles.marginTop || '0px',
                  marginBottom: block.styles.marginBottom || '20px',
                  textAlign: block.styles.textAlign || 'left',
                  opacity: block.styles.opacity || '1',
                  display: block.styles.display || 'block',
                  width: block.styles.display === 'inline-block' ? (block.styles.width || 'auto') : '100%',
                  marginRight: block.styles.marginRight || '0px',
                  padding: block.styles.padding || '0px',
                  backgroundColor: block.styles.backgroundColor || 'transparent',
                  borderLeft: block.styles.borderLeft || 'none',
                  border: block.styles.border || 'none',
                  borderRadius: block.styles.borderRadius || '0px',
                }}
              >
                {block.type === 'text' ? (
                  <p
                    style={{
                      fontSize: block.styles.fontSize || '16px',
                      fontWeight: block.styles.fontWeight || '400',
                      color: block.styles.color || '#333333',
                      lineHeight: block.styles.lineHeight || '1.6',
                      letterSpacing: block.styles.letterSpacing || 'normal',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {block.content}
                  </p>
                ) : (
                  <div 
                    className="flex h-full"
                    style={{
                      justifyContent: 
                        block.styles.textAlign === 'center' ? 'center' : 
                        block.styles.textAlign === 'right' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <img
                      src={block.content}
                      alt="Home content"
                      style={{
                        width: '100%',
                        height: block.styles.height || 'auto',
                        borderRadius: block.styles.borderRadius || '0px',
                        border: block.styles.border || 'none',
                        boxShadow: block.styles.boxShadow || 'none',
                        objectFit: 'cover'
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        {data?.home?.hero?.image && (
          <img 
            src={data.home.hero.image} 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}
      </section>

      {/* Hero Text Section */}
      <section className="bg-gray-100 py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-4 px-6 border-l-4 border-[#C8102E] bg-white shadow-sm"
          >
            <h1 className="text-lg md:text-xl font-bold text-gray-700 text-center md:text-left">
              {data?.home?.hero?.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-800 mb-8 border-l-4 border-[#C8102E] pl-4">
            {data?.home?.solutions?.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data?.home?.solutions?.items?.map((item: any, idx: number) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-sm mb-4">
                  {item?.image && (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <p className="text-sm font-semibold text-center text-gray-600 group-hover:text-[#C8102E] transition-colors">
                  {item?.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-800 mb-8 border-l-4 border-[#C8102E] pl-4">
            {data?.home?.products?.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data?.home?.products?.items?.map((item: any, idx: number) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-sm mb-4">
                  {item?.image && (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <p className="text-sm font-semibold text-center text-gray-600 group-hover:text-[#C8102E] transition-colors">
                  {item?.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
