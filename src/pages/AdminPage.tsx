import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'motion/react';
import { Save, LogOut, Image as ImageIcon, Type, Layout as LayoutIcon, ArrowLeft, Trash2, Plus, Settings, ChevronDown, ChevronUp, AlignLeft, AlignCenter, AlignRight, Bold, Palette, Move, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

interface AdminPageProps {
  data: any;
  onUpdate: (newData: any) => void;
}

const TEMPLATES: any = {
  'Standard': {
    preview: 'https://picsum.photos/seed/std/400/300',
    description: 'Clean layout with title, image, and text.',
    blocks: [
      { id: 1, type: 'text', content: 'Page Title', styles: { fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '40px' } },
      { id: 2, type: 'image', content: 'https://picsum.photos/1200/600', styles: { width: '100%', borderRadius: '12px', marginBottom: '40px' } },
      { id: 3, type: 'text', content: 'Add your content here...', styles: { fontSize: '18px', fontWeight: '400', textAlign: 'left' } }
    ]
  },
  'Home Style': {
    preview: 'https://picsum.photos/seed/home/400/300',
    description: 'Dynamic home page with hero and grid layout.',
    blocks: [
      { id: 1, type: 'image', content: 'https://picsum.photos/1920/600', styles: { width: '100%', height: '500px', marginBottom: '20px' } },
      { id: 2, type: 'text', content: 'Welcome to CK Corporation', styles: { fontSize: '24px', fontWeight: '700', textAlign: 'center', color: '#C8102E', border: '1px solid #eee', padding: '20px', backgroundColor: '#f9f9f9' } },
      { id: 3, type: 'text', content: 'Our Solutions', styles: { fontSize: '28px', fontWeight: '700', textAlign: 'left', borderLeft: '4px solid #C8102E', paddingLeft: '16px', marginTop: '40px', marginBottom: '20px' } },
      { id: 4, type: 'image', content: 'https://picsum.photos/400/300', styles: { width: '32%', borderRadius: '4px', display: 'inline-block', marginRight: '1%' } },
      { id: 5, type: 'image', content: 'https://picsum.photos/400/300', styles: { width: '32%', borderRadius: '4px', display: 'inline-block', marginRight: '1%' } },
      { id: 6, type: 'image', content: 'https://picsum.photos/400/300', styles: { width: '32%', borderRadius: '4px', display: 'inline-block' } }
    ]
  },
  'Split Layout': {
    preview: 'https://picsum.photos/seed/split/400/300',
    description: 'Modern 50/50 split of image and text.',
    blocks: [
      { id: 1, type: 'image', content: 'https://picsum.photos/600/600', styles: { width: '48%', borderRadius: '12px', display: 'inline-block', marginRight: '4%' } },
      { id: 2, type: 'text', content: 'Section Title\n\nDetailed description goes here. This layout is great for highlighting features with accompanying visuals.', styles: { width: '48%', fontSize: '18px', fontWeight: '400', display: 'inline-block', textAlign: 'left', marginTop: '40px' } }
    ]
  }
};

const AdminPage: React.FC<AdminPageProps> = ({ data, onUpdate }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [localData, setLocalData] = useState(data);
  const [activeTab, setActiveTab] = useState('general');
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    setIsReorderMode(false); // Reset reorder mode when tab changes
  }, [activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === (data.adminPassword || 'admin123')) {
      setIsLoggedIn(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localData),
      });
      if (response.ok) {
        onUpdate(localData);
        alert('Changes saved successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || response.statusText;
        if (response.status === 404 || response.status === 405) {
          alert(`Failed to save changes: This site is hosted on a static platform (like GitHub Pages) which doesn't support saving changes directly to the server. \n\nPlease use the admin panel in your local development environment to make changes, then push the updated siteData.json to GitHub.`);
        } else {
          alert(`Failed to save changes: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save changes. Please check your connection.');
    }
  };

  const generateIndustrialImages = async () => {
    console.log('generateIndustrialImages called');
    if (!window.confirm('This will generate 7 industrial images using AI and replace the current ones on the Home page. Continue?')) return;
    
    setIsGenerating(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      console.log('API Key check:', apiKey ? 'Present' : 'Missing');
      
      if (!apiKey || apiKey === 'undefined' || apiKey === '') {
        throw new Error('Gemini API Key is not configured. Please ensure GEMINI_API_KEY is set in your environment.');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompts = [
        { path: ['home', 'hero', 'image'], prompt: "A professional high-resolution wide-angle photo of a large scale industrial engineering and fabrication facility with heavy machinery and steel structures, bright daylight, cinematic lighting." },
        { path: ['home', 'solutions', 'items', 0, 'image'], prompt: "A professional industrial photo of a Heat Recovery Steam Generator (HRSG) unit at a power plant, complex piping and steel structure, technical detail." },
        { path: ['home', 'solutions', 'items', 1, 'image'], prompt: "A professional photo of modular construction blocks for an industrial plant, large steel modules being assembled, crane in background." },
        { path: ['home', 'solutions', 'items', 2, 'image'], prompt: "A professional industrial photo of a large evaporator unit for a desalination plant, massive cylindrical steel vessel with complex internal structures visible or nearby piping." },
        { path: ['home', 'products', 'items', 0, 'image'], prompt: "A professional photo of a chemical reactor vessel made of Cr-Mo steel, heavy industrial equipment, shiny metallic surface, technical engineering shot." },
        { path: ['home', 'products', 'items', 1, 'image'], prompt: "A professional photo of a high pressure shell and tube heat exchanger, industrial scale, complex engineering detail, metallic finish." },
        { path: ['home', 'products', 'items', 2, 'image'], prompt: "A professional photo of a tall industrial distillation tower or column, pressure vessel, vertical structure with platforms and ladders, industrial site." }
      ];

      const newData = { ...localData };

      for (const item of prompts) {
        console.log(`Generating image for: ${item.prompt}`);
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: item.prompt }] },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
            },
          },
        });

        let base64Image = '';
        if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              base64Image = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
        }

        if (base64Image) {
          // Update nested property
          let current: any = newData;
          for (let i = 0; i < item.path.length - 1; i++) {
            current = current[item.path[i]];
          }
          current[item.path[item.path.length - 1]] = base64Image;
        } else {
          console.warn(`No image data returned for prompt: ${item.prompt}`);
        }
      }

      setLocalData(newData);
      alert('Industrial images generated successfully! Don\'t forget to save your changes.');
    } catch (error: any) {
      console.error('Generation error:', error);
      alert(`Failed to generate images: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent outline-none"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#C8102E] text-white py-2 rounded-lg font-semibold hover:bg-[#a00d25] transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a202c] text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold tracking-tight">CMS Dashboard</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'general' ? 'bg-[#C8102E]' : 'hover:bg-gray-800'}`}
          >
            <LayoutIcon size={18} /> General
          </button>
          <button
            onClick={() => setActiveTab('navigation')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'navigation' ? 'bg-[#C8102E]' : 'hover:bg-gray-800'}`}
          >
            <LayoutIcon size={18} /> Navigation
          </button>

          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-t border-gray-700 mt-2">Pages</div>
          {localData.navigation.map((nav: any) => {
            const tabId = nav.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const Icon = tabId === 'contact' ? ImageIcon : Type;
            return (
              <div key={nav.name} className="space-y-1">
                <button
                  onClick={() => setActiveTab(tabId)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === tabId ? 'bg-[#C8102E]' : 'hover:bg-gray-800'}`}
                >
                  <Icon size={18} /> {nav.name}
                </button>
                {nav.dropdown && nav.dropdown.length > 0 && (
                  <div className="pl-6 space-y-1">
                    {nav.dropdown.map((sub: any) => {
                      const subTabId = sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <button
                          key={sub.name}
                          onClick={() => setActiveTab(subTabId)}
                          className={`w-full flex items-center gap-2 px-4 py-1.5 text-sm rounded-lg transition-colors ${activeTab === subTabId ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${activeTab === subTabId ? 'bg-[#C8102E]' : 'bg-gray-600'}`} />
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-t border-gray-700 mt-2">System</div>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-[#C8102E]' : 'hover:bg-gray-800'}`}
          >
            <Save size={18} /> Settings
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400"
          >
            <ArrowLeft size={18} /> Back to Site
          </Link>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800 uppercase tracking-wider">
            Editing: {
              activeTab === 'general' ? 'General Settings' :
              activeTab === 'navigation' ? 'Navigation Menu' :
              activeTab === 'settings' ? 'Admin Settings' :
              localData.navigation.find((n: any) => n.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === activeTab)?.name || activeTab
            }
          </h1>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Save size={18} /> Save Changes
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Logo & Branding</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Logo Text</label>
                    <input
                      type="text"
                      value={localData.logo.text}
                      onChange={(e) => setLocalData({ ...localData, logo: { ...localData.logo, text: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Logo Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={localData.logo.image}
                        onChange={(e) => setLocalData({ ...localData, logo: { ...localData.logo, image: e.target.value } })}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E]"
                      />
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-gray-200 text-sm font-semibold text-gray-600">
                        <ImageIcon size={16} />
                        <span>Upload</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setLocalData({ ...localData, logo: { ...localData.logo, image: reader.result as string } });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Main Email</label>
                    <input
                      type="email"
                      value={localData.contact.email}
                      onChange={(e) => setLocalData({ ...localData, contact: { ...localData.contact, email: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Alternative Email</label>
                    <input
                      type="email"
                      value={localData.contact.emailAlt}
                      onChange={(e) => setLocalData({ ...localData, contact: { ...localData.contact, emailAlt: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={localData.contact.phone}
                      onChange={(e) => setLocalData({ ...localData, contact: { ...localData.contact, phone: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Fax Number</label>
                    <input
                      type="text"
                      value={localData.contact.fax}
                      onChange={(e) => setLocalData({ ...localData, contact: { ...localData.contact, fax: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                    <textarea
                      value={localData.contact.address}
                      onChange={(e) => setLocalData({ ...localData, contact: { ...localData.contact, address: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E] h-20"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Contact Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={localData.contact.image}
                        onChange={(e) => setLocalData({ ...localData, contact: { ...localData.contact, image: e.target.value } })}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E]"
                      />
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-gray-200 text-sm font-semibold text-gray-600">
                        <ImageIcon size={16} />
                        <span>Upload</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setLocalData({ ...localData, contact: { ...localData.contact, image: reader.result as string } });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Admin Settings</h3>
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Change Admin Password</label>
                  <input
                    type="text"
                    value={localData.adminPassword || ''}
                    onChange={(e) => setLocalData({ ...localData, adminPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E]"
                    placeholder="Enter new password"
                  />
                  <p className="mt-2 text-xs text-gray-400">This password will be required for the next login.</p>
                </div>
              </div>
            )}

            {activeTab === 'home' && !localData.home.blocks && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-500" />
                      Industrial Image Pack
                    </h4>
                    <p className="text-xs text-gray-500">Generate 7 professional industrial images for your Home page sections.</p>
                  </div>
                  <button
                    onClick={generateIndustrialImages}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Generate Images</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm flex justify-between items-center">
                  <span>You are using the default Home layout. To use the block-based editor, apply a template.</span>
                  <button 
                    onClick={() => {
                      if (window.confirm('Convert to block-based layout? This will allow more flexible editing.')) {
                        const newBlocks = [
                          { id: 1, type: 'image', content: localData.home.hero.image, styles: { width: '100%', height: '500px', marginBottom: '20px' } },
                          { id: 2, type: 'text', content: localData.home.hero.title, styles: { fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '40px' } }
                        ];
                        setLocalData({ ...localData, home: { ...localData.home, blocks: newBlocks } });
                      }
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold"
                  >
                    Convert to Blocks
                  </button>
                </div>
                
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Hero Section</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Hero Title</label>
                    <textarea
                      value={localData.home.hero.title}
                      onChange={(e) => setLocalData({ ...localData, home: { ...localData.home, hero: { ...localData.home.hero, title: e.target.value } } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E] h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Hero Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={localData.home.hero.image}
                        onChange={(e) => setLocalData({ ...localData, home: { ...localData.home, hero: { ...localData.home.hero, image: e.target.value } } })}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E]"
                      />
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-gray-200 text-sm font-semibold text-gray-600">
                        <ImageIcon size={16} />
                        <span>Upload</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setLocalData({ ...localData, home: { ...localData.home, hero: { ...localData.home.hero, image: reader.result as string } } });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Solutions Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {localData.home.solutions.items.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 border border-gray-100 rounded-lg space-y-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase">Solution {idx + 1}</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...localData.home.solutions.items];
                            newItems[idx].title = e.target.value;
                            setLocalData({ ...localData, home: { ...localData.home, solutions: { ...localData.home.solutions, items: newItems } } });
                          }}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded outline-none focus:ring-2 focus:ring-[#C8102E]"
                        />
                        <div className="flex gap-1">
                           <input
                            type="text"
                            value={item.image}
                            onChange={(e) => {
                              const newItems = [...localData.home.solutions.items];
                              newItems[idx].image = e.target.value;
                              setLocalData({ ...localData, home: { ...localData.home, solutions: { ...localData.home.solutions, items: newItems } } });
                            }}
                            className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded outline-none"
                          />
                          <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 p-1 rounded border border-gray-200">
                            <ImageIcon size={14} />
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const newItems = [...localData.home.solutions.items];
                                    newItems[idx].image = reader.result as string;
                                    setLocalData({ ...localData, home: { ...localData.home, solutions: { ...localData.home.solutions, items: newItems } } });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Products Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {localData.home.products.items.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 border border-gray-100 rounded-lg space-y-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase">Product {idx + 1}</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...localData.home.products.items];
                            newItems[idx].title = e.target.value;
                            setLocalData({ ...localData, home: { ...localData.home, products: { ...localData.home.products, items: newItems } } });
                          }}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded outline-none focus:ring-2 focus:ring-[#C8102E]"
                        />
                        <div className="flex gap-1">
                           <input
                            type="text"
                            value={item.image}
                            onChange={(e) => {
                              const newItems = [...localData.home.products.items];
                              newItems[idx].image = e.target.value;
                              setLocalData({ ...localData, home: { ...localData.home, products: { ...localData.home.products, items: newItems } } });
                            }}
                            className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded outline-none"
                          />
                          <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 p-1 rounded border border-gray-200">
                            <ImageIcon size={14} />
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const newItems = [...localData.home.products.items];
                                    newItems[idx].image = reader.result as string;
                                    setLocalData({ ...localData, home: { ...localData.home, products: { ...localData.home.products, items: newItems } } });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Generic Editor for dynamic pages */}
            {!['general', 'navigation', 'contact', 'settings'].includes(activeTab) && !(activeTab === 'home' && !localData.home.blocks) && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-800 uppercase">
                    {localData.navigation.find((n: any) => n.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === activeTab)?.name || activeTab} Page Content
                  </h3>
                  <div className="flex gap-2">
                    <div className="relative group/templates">
                      <button className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded font-semibold transition-colors">
                        <LayoutIcon size={14} /> Design Templates
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover/templates:opacity-100 group-hover/templates:visible transition-all z-50">
                        <div className="p-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase rounded-t-lg">Select a Template</div>
                        {Object.keys(TEMPLATES).map(name => (
                          <div 
                            key={name}
                            onMouseEnter={() => setHoveredTemplate(name)}
                            onMouseLeave={() => setHoveredTemplate(null)}
                            className="relative"
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (window.confirm(`Apply "${name}" template? This will replace current content.`)) {
                                  const newBlocks = TEMPLATES[name].blocks.map((b: any) => ({ 
                                    ...b, 
                                    id: Date.now() + Math.random(),
                                    styles: { ...b.styles } // Deep copy styles
                                  }));
                                  
                                  setLocalData(prev => {
                                    const updated = { ...prev };
                                    updated[activeTab] = {
                                      ...(prev[activeTab] || {}),
                                      blocks: newBlocks
                                    };
                                    return updated;
                                  });
                                }
                              }}
                              className="w-full text-left px-4 py-3 text-xs hover:bg-indigo-50 transition-colors border-b border-gray-50 last:border-b-0 flex flex-col gap-1"
                            >
                              <span className="font-bold text-gray-700">{name}</span>
                              <span className="text-[10px] text-gray-400 line-clamp-1">{TEMPLATES[name].description}</span>
                            </button>
                            
                            {hoveredTemplate === name && (
                              <div className="absolute right-full top-0 mr-2 w-64 bg-white border border-gray-200 rounded-lg shadow-2xl p-2 z-[60] animate-in fade-in zoom-in duration-200">
                                <div className="aspect-video rounded overflow-hidden mb-2 border border-gray-100 bg-gray-50">
                                  <img src={TEMPLATES[name].preview} alt={name} className="w-full h-full object-cover" />
                                </div>
                                <p className="text-[10px] text-gray-500 italic leading-relaxed">{TEMPLATES[name].description}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const newBlocks = [...(localData[activeTab]?.blocks || [])];
                        newBlocks.push({ 
                          id: Date.now(), 
                          type: 'text', 
                          content: 'New Text Block', 
                          styles: { fontSize: '16px', fontWeight: '400', color: '#333333', textAlign: 'left', marginTop: '0px', marginBottom: '20px' } 
                        });
                        setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                      }}
                      className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-semibold transition-colors"
                    >
                      <Plus size={14} /> Add Text
                    </button>
                    <button 
                      onClick={() => {
                        const newBlocks = [...(localData[activeTab]?.blocks || [])];
                        newBlocks.push({ 
                          id: Date.now(), 
                          type: 'image', 
                          content: 'https://picsum.photos/800/400', 
                          styles: { width: '100%', height: 'auto', marginTop: '0px', marginBottom: '20px', borderRadius: '0px' } 
                        });
                        setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                      }}
                      className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-semibold transition-colors"
                    >
                      <ImageIcon size={14} /> Add Image
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  {localData[activeTab]?.blocks?.map((block: any, bIdx: number) => (
                    <div key={block.id} className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm space-y-4 relative group">
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          disabled={bIdx === 0}
                          onClick={() => {
                            const newBlocks = [...localData[activeTab].blocks];
                            [newBlocks[bIdx], newBlocks[bIdx-1]] = [newBlocks[bIdx-1], newBlocks[bIdx]];
                            setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                          }}
                          className="p-1 bg-white border border-gray-200 rounded shadow-sm hover:text-[#C8102E] disabled:opacity-30"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button 
                          disabled={bIdx === localData[activeTab].blocks.length - 1}
                          onClick={() => {
                            const newBlocks = [...localData[activeTab].blocks];
                            [newBlocks[bIdx], newBlocks[bIdx+1]] = [newBlocks[bIdx+1], newBlocks[bIdx]];
                            setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                          }}
                          className="p-1 bg-white border border-gray-200 rounded shadow-sm hover:text-[#C8102E] disabled:opacity-30"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                          {block.type === 'text' ? <Type size={14} /> : <ImageIcon size={14} />}
                          {block.type} Block
                        </div>
                        <button 
                          onClick={() => {
                            const newBlocks = localData[activeTab].blocks.filter((_: any, i: number) => i !== bIdx);
                            setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                          {block.type === 'text' ? (
                            <textarea
                              value={block.content}
                              onChange={(e) => {
                                const newBlocks = [...localData[activeTab].blocks];
                                newBlocks[bIdx].content = e.target.value;
                                setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                              }}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E] h-32"
                              placeholder="Enter text content..."
                            />
                          ) : (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={block.content}
                                  onChange={(e) => {
                                    const newBlocks = [...localData[activeTab].blocks];
                                    newBlocks[bIdx].content = e.target.value;
                                    setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                  }}
                                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C8102E]"
                                  placeholder="Image URL..."
                                />
                                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-gray-200 text-sm font-semibold text-gray-600">
                                  <ImageIcon size={16} />
                                  <span>Upload</span>
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          const base64String = reader.result as string;
                                          const newBlocks = [...localData[activeTab].blocks];
                                          newBlocks[bIdx].content = base64String;
                                          setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                                <img src={block.content} alt="Preview" className="max-h-full object-contain" onError={(e: any) => e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'} />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase mb-2">
                            <Settings size={12} /> Styling Options
                          </div>
                          
                          {block.type === 'text' && (
                            <>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] text-gray-500 mb-1">Font Size</label>
                                  <input 
                                    type="text" 
                                    value={block.styles.fontSize} 
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.fontSize = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                    placeholder="e.g. 16px"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-gray-500 mb-1">Weight</label>
                                  <select 
                                    value={block.styles.fontWeight}
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.fontWeight = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                  >
                                    <option value="300">Light</option>
                                    <option value="400">Regular</option>
                                    <option value="600">Semi-Bold</option>
                                    <option value="700">Bold</option>
                                    <option value="900">Black</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] text-gray-500 mb-1">Line Height</label>
                                  <input 
                                    type="text" 
                                    value={block.styles.lineHeight || ''} 
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.lineHeight = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                    placeholder="e.g. 1.6"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-gray-500 mb-1">Spacing</label>
                                  <input 
                                    type="text" 
                                    value={block.styles.letterSpacing || ''} 
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.letterSpacing = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                    placeholder="e.g. 1px"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[10px] text-gray-500 mb-1">Background Color</label>
                                  <div className="flex gap-2">
                                    <input 
                                      type="color" 
                                      value={block.styles.backgroundColor || '#ffffff'} 
                                      onChange={(e) => {
                                        const newBlocks = [...localData[activeTab].blocks];
                                        newBlocks[bIdx].styles.backgroundColor = e.target.value;
                                        setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                      }}
                                      className="w-8 h-8 border-none p-0 bg-transparent cursor-pointer"
                                    />
                                    <input 
                                      type="text" 
                                      value={block.styles.backgroundColor || ''} 
                                      onChange={(e) => {
                                        const newBlocks = [...localData[activeTab].blocks];
                                        newBlocks[bIdx].styles.backgroundColor = e.target.value;
                                        setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                      }}
                                      className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded"
                                      placeholder="e.g. #f3f4f6"
                                    />
                                  </div>
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[10px] text-gray-500 mb-1">Padding</label>
                                  <input 
                                    type="text" 
                                    value={block.styles.padding || ''} 
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.padding = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                    placeholder="e.g. 20px"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[10px] text-gray-500 mb-1">Border Left (Accent)</label>
                                  <input 
                                    type="text" 
                                    value={block.styles.borderLeft || ''} 
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.borderLeft = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                    placeholder="e.g. 4px solid #C8102E"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] text-gray-500 mb-1">Color</label>
                                <div className="flex gap-2">
                                  <input 
                                    type="color" 
                                    value={block.styles.color} 
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.color = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="w-8 h-8 border-none p-0 bg-transparent cursor-pointer"
                                  />
                                  <input 
                                    type="text" 
                                    value={block.styles.color} 
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.color = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] text-gray-500 mb-1">Alignment</label>
                                <div className="flex border border-gray-200 rounded overflow-hidden">
                                  <button 
                                    onClick={() => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.textAlign = 'left';
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className={`flex-1 p-1.5 flex justify-center ${block.styles.textAlign === 'left' ? 'bg-gray-200' : 'bg-white'}`}
                                  >
                                    <AlignLeft size={14} />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.textAlign = 'center';
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className={`flex-1 p-1.5 flex justify-center ${block.styles.textAlign === 'center' ? 'bg-gray-200' : 'bg-white'}`}
                                  >
                                    <AlignCenter size={14} />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.textAlign = 'right';
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className={`flex-1 p-1.5 flex justify-center ${block.styles.textAlign === 'right' ? 'bg-gray-200' : 'bg-white'}`}
                                  >
                                    <AlignRight size={14} />
                                  </button>
                                </div>
                              </div>
                            </>
                          )}

                          {block.type === 'image' && (
                            <>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] text-gray-500 mb-1">Width</label>
                                  <input 
                                    type="text" 
                                    value={block.styles.width} 
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.width = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-gray-500 mb-1">Radius</label>
                                  <input 
                                    type="text" 
                                    value={block.styles.borderRadius} 
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.borderRadius = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-gray-500 mb-1">Border</label>
                                  <input 
                                    type="text" 
                                    value={block.styles.border || ''} 
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.border = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                    placeholder="e.g. 1px solid #ccc"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-gray-500 mb-1">Shadow</label>
                                  <input 
                                    type="text" 
                                    value={block.styles.boxShadow || ''} 
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.boxShadow = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                    placeholder="e.g. 0 4px 6px rgba(0,0,0,0.1)"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[10px] text-gray-500 mb-1">Display Mode</label>
                                  <select 
                                    value={block.styles.display || 'block'}
                                    onChange={(e) => {
                                      const newBlocks = [...localData[activeTab].blocks];
                                      newBlocks[bIdx].styles.display = e.target.value;
                                      setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                  >
                                    <option value="block">Full Width (Block)</option>
                                    <option value="inline-block">Side-by-Side (Inline-Block)</option>
                                  </select>
                                </div>
                                {block.styles.display === 'inline-block' && (
                                  <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Right Margin</label>
                                    <input 
                                      type="text" 
                                      value={block.styles.marginRight || ''} 
                                      onChange={(e) => {
                                        const newBlocks = [...localData[activeTab].blocks];
                                        newBlocks[bIdx].styles.marginRight = e.target.value;
                                        setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                      }}
                                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                      placeholder="e.g. 2%"
                                    />
                                  </div>
                                )}
                              </div>
                            </>
                          )}

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 mt-2">
                            <div>
                              <label className="block text-[10px] text-gray-500 mb-1">Margin Top</label>
                              <input 
                                type="text" 
                                value={block.styles.marginTop} 
                                onChange={(e) => {
                                  const newBlocks = [...localData[activeTab].blocks];
                                  newBlocks[bIdx].styles.marginTop = e.target.value;
                                  setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                }}
                                className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-500 mb-1">Margin Bottom</label>
                              <input 
                                type="text" 
                                value={block.styles.marginBottom} 
                                onChange={(e) => {
                                  const newBlocks = [...localData[activeTab].blocks];
                                  newBlocks[bIdx].styles.marginBottom = e.target.value;
                                  setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                }}
                                className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] text-gray-500 mb-1">Opacity (0-1)</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.1"
                                value={block.styles.opacity || 1} 
                                onChange={(e) => {
                                  const newBlocks = [...localData[activeTab].blocks];
                                  newBlocks[bIdx].styles.opacity = e.target.value;
                                  setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                                }}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C8102E]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!localData[activeTab]?.blocks || localData[activeTab]?.blocks.length === 0) && (
                    <div className="p-12 border-2 border-dashed border-gray-200 rounded-xl text-center space-y-4">
                      <div className="flex justify-center">
                        <LayoutIcon size={48} className="text-gray-300" />
                      </div>
                      <p className="text-gray-500">This page has no content blocks yet.</p>
                      <button 
                        onClick={() => {
                          setLocalData({ 
                            ...localData, 
                            [activeTab]: { 
                              ...localData[activeTab],
                              blocks: [
                                { 
                                  id: Date.now(), 
                                  type: 'text', 
                                  content: 'Welcome to the new page!', 
                                  styles: { fontSize: '32px', fontWeight: '700', color: '#1a202c', textAlign: 'center', marginTop: '40px', marginBottom: '20px' } 
                                },
                                { 
                                  id: Date.now() + 1, 
                                  type: 'text', 
                                  content: 'Start adding your content here.', 
                                  styles: { fontSize: '18px', fontWeight: '400', color: '#4a5568', textAlign: 'center', marginTop: '0px', marginBottom: '40px' } 
                                }
                              ] 
                            } 
                          });
                        }}
                        className="bg-[#C8102E] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#a00d25] transition-colors"
                      >
                        Initialize with Default Blocks
                      </button>
                    </div>
                  )}

                  {/* Drag Reorder Option at the bottom */}
                  {localData[activeTab]?.blocks?.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Move size={20} className="text-[#C8102E]" />
                            Visual Layout Reorder (PowerPoint Style)
                          </h4>
                          <p className="text-sm text-gray-500">Drag and drop blocks to rearrange their order on the page.</p>
                        </div>
                        <button 
                          onClick={() => setIsReorderMode(!isReorderMode)}
                          className={`px-6 py-2 rounded-lg font-bold transition-all ${isReorderMode ? 'bg-[#C8102E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {isReorderMode ? 'Exit Reorder Mode' : 'Enable Drag Reorder'}
                        </button>
                      </div>

                      {isReorderMode && (
                        <Reorder.Group 
                          axis="y" 
                          values={localData[activeTab].blocks} 
                          onReorder={(newBlocks) => {
                            setLocalData({ ...localData, [activeTab]: { ...localData[activeTab], blocks: newBlocks } });
                          }}
                          className="space-y-3"
                        >
                          {localData[activeTab].blocks.map((block: any) => (
                            <Reorder.Item 
                              key={block.id} 
                              value={block}
                              className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl flex items-center gap-4 cursor-grab active:cursor-grabbing hover:border-[#C8102E] transition-colors shadow-sm"
                            >
                              <div className="p-2 bg-gray-50 rounded text-gray-400">
                                <Move size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase mb-1">
                                  {block.type === 'text' ? <Type size={12} /> : <ImageIcon size={12} />}
                                  {block.type} Block
                                </div>
                                <p className="text-sm text-gray-600 truncate">
                                  {block.type === 'text' ? block.content : 'Image: ' + block.content}
                                </p>
                              </div>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
