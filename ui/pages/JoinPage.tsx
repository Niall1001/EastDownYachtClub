import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, Phone, MapPin, Lock, User } from 'lucide-react';
const JoinPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = e => {
    e.preventDefault();
    // This is a simple simulation of login
    // In a real app, you would validate against a backend
    if (email && password) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Please enter both email and password');
    }
  };
  const membershipTypes = [{
    title: 'Family Membership',
    description: 'For couples and families with children under 18',
    price: '£450 per year',
    features: ['Access for all family members', 'Includes children under 18', 'Voting rights for adults', 'Discounted training courses']
  }, {
    title: 'Full Membership',
    description: 'For individual adult sailors',
    price: '£320 per year',
    features: ['Full access to all facilities', 'Voting rights', 'Club racing participation', 'Discounted training courses']
  }, {
    title: 'Youth Membership',
    description: 'For sailors aged 18-25',
    price: '£160 per year',
    features: ['Full access to all facilities', 'Discounted training courses', 'Mentoring opportunities', 'Social events']
  }, {
    title: 'Junior Membership',
    description: 'For sailors under 18',
    price: '£80 per year',
    features: ['Access under parental supervision', 'Junior training programs', 'Junior racing series', 'Social events']
  }, {
    title: 'Social Membership',
    description: 'For non-sailing supporters',
    price: '£120 per year',
    features: ['Clubhouse access', 'Social events participation', 'No voting rights', 'Crewing opportunities']
  }, {
    title: 'Temporary Membership',
    description: 'For visitors and short-term sailors',
    price: '£30 per week',
    features: ['Weekly access to facilities', 'Visitor mooring/berthing', 'Participation in open events', 'Clubhouse access']
  }];
  return <div className="bg-white">
      {/* Page Header - Moved wave down for better visibility */}
      <div className="bg-[#1e3a8a] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Become A Member
            </h1>
            <p className="text-lg md:text-xl mb-12">
              Join our vibrant sailing community and experience the joy of
              sailing on Strangford Lough
            </p>
          </div>
        </div>
        {/* Wave decoration - moved down */}
        <div className="relative h-16 mt-12">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="absolute bottom-0 w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L60,53.3C120,43,240,21,360,21.3C480,21,600,43,720,53.3C840,64,960,64,1080,58.7C1200,53,1320,43,1380,37.3L1440,32L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
          </svg>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        {/* Intro Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">
            Join Our Community
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            East Down Yacht Club offers a range of membership options to suit
            sailors of all ages and experience levels. Whether you're a seasoned
            racer, a cruising enthusiast, or new to sailing, we have a
            membership category that's right for you.
          </p>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h3 className="font-bold text-lg text-[#1e3a8a] mb-2">
              Membership Benefits
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-[#0284c7] mr-2">✓</span>
                <span className="text-gray-600">
                  Access to club facilities including slipways, moorings, and
                  clubhouse
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0284c7] mr-2">✓</span>
                <span className="text-gray-600">
                  Participation in club racing and social events
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0284c7] mr-2">✓</span>
                <span className="text-gray-600">
                  Discounted training courses and RYA certifications
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0284c7] mr-2">✓</span>
                <span className="text-gray-600">
                  Club boat rental opportunities
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0284c7] mr-2">✓</span>
                <span className="text-gray-600">
                  Monthly newsletter and exclusive member communications
                </span>
              </li>
            </ul>
          </div>
        </div>
        {/* Main content grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Membership Types */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6">
                  Membership Options
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {membershipTypes.map((type, index) => <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold text-[#1e3a8a] mb-2">
                        {type.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{type.description}</p>
                      <p className="text-[#0284c7] font-bold mb-4">
                        {type.price}
                      </p>
                      <ul className="space-y-2 mb-4">
                        {type.features.map((feature, i) => <li key={i} className="flex items-start">
                            <span className="text-[#0284c7] mr-2">✓</span>
                            <span className="text-gray-600">{feature}</span>
                          </li>)}
                      </ul>
                    </div>)}
                </div>
              </div>
              {/* Application Process */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#1e3a8a] mb-4">
                  How to Apply
                </h2>
                <p className="text-gray-600 mb-4">
                  To apply for membership at East Down Yacht Club, please follow
                  these steps:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-gray-600 mb-8">
                  <li>Download and complete the membership application form</li>
                  <li>
                    Return the completed form to our Membership Secretary by
                    email or post
                  </li>
                  <li>
                    Your application will be reviewed by the committee at the
                    next monthly meeting
                  </li>
                  <li>
                    Upon approval, you'll receive payment instructions for your
                    membership fees
                  </li>
                  <li>
                    Once payment is received, your membership will be activated
                  </li>
                </ol>
                <div className="flex justify-center">
                  <a href="/membership/application_form.pdf" download className="inline-flex items-center bg-[#dc2626] hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
                    <FileText size={20} className="mr-2" />
                    Download Application Form
                  </a>
                </div>
              </div>
              {/* FAQ Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#1e3a8a] mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <h3 className="font-bold text-[#1e3a8a] mb-2">
                      Do I need to own a boat to join?
                    </h3>
                    <p className="text-gray-600">
                      No, many of our members don't own boats. You can still
                      participate in club activities, crew for other members, or
                      use club boats (subject to qualification and
                      availability).
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <h3 className="font-bold text-[#1e3a8a] mb-2">
                      What are the current membership fees?
                    </h3>
                    <p className="text-gray-600">
                      Membership fees vary depending on the category. For
                      current rates, please download our membership booklet or
                      contact our Membership Secretary.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <h3 className="font-bold text-[#1e3a8a] mb-2">
                      Is there training available for beginners?
                    </h3>
                    <p className="text-gray-600">
                      Yes, we offer RYA-certified training courses for all
                      levels, from complete beginners to advanced sailors.
                      Members receive discounted rates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Members Area */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-4 mb-8">
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-4 flex items-center">
                  <Lock size={20} className="mr-2" />
                  Members Area
                </h3>
                {!isLoggedIn ? <>
                    <p className="text-gray-600 mb-4">
                      Current members can log in to access the membership
                      booklet and other exclusive resources.
                    </p>
                    <form onSubmit={handleLogin}>
                      {loginError && <div className="bg-red-50 text-red-700 p-2 rounded mb-4 text-sm">
                          {loginError}
                        </div>}
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <input type="email" id="email" className="pl-9 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                          <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input type="password" id="password" className="pl-9 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                          <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white py-2 px-4 rounded transition-colors">
                        Log In
                      </button>
                      <div className="mt-3 text-center">
                        <a href="#" className="text-sm text-[#0284c7] hover:text-blue-800">
                          Forgot your password?
                        </a>
                      </div>
                    </form>
                  </> : <div>
                    <div className="flex items-center mb-4 bg-green-50 p-3 rounded-lg">
                      <User size={20} className="mr-2 text-green-600" />
                      <span className="text-green-800">
                        Successfully logged in
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-3">
                      Member Resources
                    </h4>
                    <ul className="space-y-3">
                      <li>
                        <a href="/membership/membership_booklet.pdf" download className="flex items-center text-[#0284c7] hover:text-blue-700">
                          <FileText size={16} className="mr-2" />
                          Download Membership Booklet
                        </a>
                      </li>
                      <li>
                        <a href="/membership/club_rules.pdf" download className="flex items-center text-[#0284c7] hover:text-blue-700">
                          <FileText size={16} className="mr-2" />
                          Club Rules & Bylaws
                        </a>
                      </li>
                      <li>
                        <a href="/membership/calendar.pdf" download className="flex items-center text-[#0284c7] hover:text-blue-700">
                          <FileText size={16} className="mr-2" />
                          Member Events Calendar
                        </a>
                      </li>
                    </ul>
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <button onClick={() => setIsLoggedIn(false)} className="text-sm text-gray-600 hover:text-gray-800">
                        Log Out
                      </button>
                    </div>
                  </div>}
              </div>
              {/* Contact box */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h3 className="font-bold text-lg text-[#1e3a8a] mb-3">
                  Contact Membership Secretary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Mail size={18} className="mr-3 text-[#0284c7] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-600">
                        membership@eastdownyc.co.uk
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone size={18} className="mr-3 text-[#0284c7] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-600">028 4461 2266</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin size={18} className="mr-3 text-[#0284c7] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-600">
                        26 Killyleagh Road, Downpatrick, BT30 9DQ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default JoinPage;