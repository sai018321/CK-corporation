import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

interface HeaderProps {
  data: any;
}

const Header: React.FC<HeaderProps> = ({ data }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const navItems = data.navigation || [];

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {data?.logo?.image && (
              <img 
                src={data.logo.image} 
                alt={data.logo.text || 'Logo'} 
                className="h-10 w-auto"
                referrerPolicy="no-referrer"
              />
            )}
            <span className="text-xl font-bold text-[#1a202c] tracking-tight">{data?.logo?.text}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center text-sm font-semibold tracking-wide transition-colors ${
                    location.pathname === item.path || (item.dropdown && location.pathname.startsWith(item.path))
                      ? 'text-[#C8102E]'
                      : 'text-gray-600 hover:text-[#C8102E]'
                  }`}
                >
                  {item.name}
                  {item.dropdown && <ChevronDown className="ml-1 w-4 h-4" />}
                </Link>

                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute left-0 mt-0 w-56 bg-white border border-gray-100 shadow-xl rounded-b-md py-2 z-50">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C8102E] transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-[#C8102E] p-2"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="px-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.name}>
                <Link
                  to={item.path}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#C8102E]"
                >
                  {item.name}
                </Link>
                {item.dropdown && (
                  <div className="pl-4 space-y-1">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        className="block px-3 py-2 text-sm text-gray-500 hover:text-[#C8102E]"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
