import React from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';

interface Block {
  id: number;
  type: 'text' | 'image';
  content: string;
  styles: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    marginTop?: string;
    marginBottom?: string;
    lineHeight?: string;
    letterSpacing?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    border?: string;
    boxShadow?: string;
    opacity?: string;
    display?: string;
    padding?: string;
    backgroundColor?: string;
    borderLeft?: string;
    marginRight?: string;
    fullWidth?: boolean;
  };
}

interface DynamicPageProps {
  data: any;
  pageKey: string;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ data, pageKey }) => {
  const location = useLocation();
  const pageData = data[pageKey];
  
  // Find if this page belongs to a category with dropdowns
  const parentNav = data.navigation.find((nav: any) => {
    const navId = nav.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (navId === pageKey) return true;
    return nav.dropdown?.some((sub: any) => sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === pageKey);
  });

  const subItems = parentNav?.dropdown || [];

  if (!pageData || !pageData.blocks) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800 uppercase tracking-tighter">
            {parentNav?.name || pageKey.replace(/-/g, ' ')}
          </h1>
          {subItems.length > 0 && (
            <div className="flex justify-center gap-6 border-b border-gray-200 pb-4 mb-8">
              {subItems.map((item: any) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === item.path ? 'text-[#C8102E]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
          <p className="text-gray-500 italic">This page is under construction or has no content yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Simple Hero for Dynamic Pages */}
      <div className="bg-[#1a202c] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter"
          >
            {parentNav?.name || pageKey.replace(/-/g, ' ')}
          </motion.h1>
        </div>
      </div>

      {subItems.length > 0 && (
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center gap-8 py-4">
              {subItems.map((item: any) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors relative py-2 ${location.pathname === item.path ? 'text-[#C8102E]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div layoutId="activeSub" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8102E]" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-16">
        {(() => {
          const isAboutOrService = parentNav?.name === 'ABOUT' || parentNav?.name === 'SERVICE';
          const firstImageIndex = pageData.blocks.findIndex((b: Block) => b.type === 'image');

          const renderBlock = (block: Block, isSideBySide = false) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                marginTop: isSideBySide ? '0px' : (block.styles.marginTop || '0px'),
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
                    alt="Page content"
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
          );

          if (isAboutOrService && firstImageIndex !== -1) {
            const beforeBlocks = pageData.blocks.slice(0, firstImageIndex);
            const imageBlock = pageData.blocks[firstImageIndex];
            const remainingBlocks = pageData.blocks.slice(firstImageIndex + 1);
            
            // Find where the side-by-side section should end
            const sideBlocksEndIndex = remainingBlocks.findIndex((b: Block) => b.styles.fullWidth);
            const sideBlocks = sideBlocksEndIndex === -1 ? remainingBlocks : remainingBlocks.slice(0, sideBlocksEndIndex);
            const bottomBlocks = sideBlocksEndIndex === -1 ? [] : remainingBlocks.slice(sideBlocksEndIndex);

            return (
              <>
                {beforeBlocks.length > 0 && (
                  <div className="flex flex-wrap mb-8">
                    {beforeBlocks.map((block: Block) => renderBlock(block))}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-12">
                  <div>
                    {renderBlock(imageBlock)}
                  </div>
                  <div className="space-y-6">
                    {sideBlocks.map((block: Block, idx: number) => renderBlock(block, idx === 0))}
                  </div>
                </div>
                {bottomBlocks.length > 0 && (
                  <div className="flex flex-wrap">
                    {bottomBlocks.map((block: Block) => renderBlock(block))}
                  </div>
                )}
              </>
            );
          }

          return (
            <div className="flex flex-wrap">
              {pageData.blocks.map((block: Block) => renderBlock(block))}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default DynamicPage;
