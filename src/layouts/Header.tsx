import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };
  const navLinkClasses = ({
    isActive
  }: {
    isActive: boolean;
  }) => `relative px-4 py-2 text-sm font-medium transition-colors duration-200 
    ${isActive ? 'text-yacht-primary font-semibold' : 'text-yacht-gray-700 hover:text-yacht-primary-light'}`;
  return <header className="w-full bg-white shadow-sm">
      {/* Top bar with contact info */}
      <div className="bg-yacht-primary text-white px-4 py-1 text-xs md:text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div>Email: info@eastdownyc.co.uk | Phone: 028 4461 2266</div>
          <div className="hidden md:flex space-x-4">
            <a href="#" className="hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </div>
      {/* Main header with logo and navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and tagline */}
          <div className="flex items-center">
            <Link to="/" className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl font-bold text-yacht-primary">
                East Down Yacht Club
              </div>
              <div className="text-xs md:text-sm italic text-yacht-primary-light">
                Set Sail with Excellence
              </div>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink to="/" className={navLinkClasses} end>
              Home
            </NavLink>
            <NavLink to="/events" className={navLinkClasses}>
              On The Water
            </NavLink>
            <NavLink to="/results" className={navLinkClasses}>
              Race Results
            </NavLink>
            <NavLink to="/club" className={navLinkClasses}>
              Our Heritage
            </NavLink>
            <NavLink to="/news" className={navLinkClasses}>
              Sailing Stories
            </NavLink>
            <NavLink to="/join" className={navLinkClasses}>
              Become A Member
            </NavLink>
            
            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative ml-4">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-sm font-medium text-yacht-gray-700 hover:text-yacht-primary px-3 py-2 rounded-lg hover:bg-yacht-gray-50 transition-colors"
                >
                  <User size={16} className="mr-2" />
                  {user?.name}
                  <ChevronDown size={16} className="ml-1" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-yacht-gray-200 py-2 z-50">
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 text-sm text-yacht-gray-700 hover:bg-yacht-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Admin Console
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-yacht-primary hover:bg-yacht-wine-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/join" className="ml-4 btn-primary-yacht text-sm px-4 py-2 rounded">
                Join Today
              </Link>
            )}
          </nav>
          {/* Mobile menu button */}
          <button className="lg:hidden text-yacht-gray-500 hover:text-yacht-gray-700" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && <nav className="lg:hidden bg-white border-t border-yacht-gray-200 px-4 py-2">
          <div className="flex flex-col space-y-3 py-3">
            <NavLink to="/" className={navLinkClasses} onClick={toggleMenu} end>
              Home
            </NavLink>
            <NavLink to="/events" className={navLinkClasses} onClick={toggleMenu}>
              On The Water
            </NavLink>
            <NavLink to="/results" className={navLinkClasses} onClick={toggleMenu}>
              Race Results
            </NavLink>
            <NavLink to="/club" className={navLinkClasses} onClick={toggleMenu}>
              Our Heritage
            </NavLink>
            <NavLink to="/news" className={navLinkClasses} onClick={toggleMenu}>
              Sailing Stories
            </NavLink>
            <NavLink to="/join" className={navLinkClasses} onClick={toggleMenu}>
              Become A Member
            </NavLink>
            
            {/* Mobile Authentication Section */}
            {isAuthenticated ? (
              <>
                <div className="border-t border-yacht-gray-200 pt-3 mt-3">
                  <div className="flex items-center px-4 py-2 text-sm text-yacht-gray-600">
                    <User size={16} className="mr-2" />
                    {user?.name}
                  </div>
                  <Link
                    to="/admin"
                    className="flex items-center px-4 py-2 text-sm text-yacht-gray-700 hover:text-yacht-primary-light"
                    onClick={toggleMenu}
                  >
                    Admin Console
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-yacht-primary hover:text-yacht-primary-dark"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link to="/join" className="btn-primary-yacht px-4 py-2 rounded text-center text-sm" onClick={toggleMenu}>
                Join Today
              </Link>
            )}
          </div>
        </nav>}
    </header>;
};
export default Header;