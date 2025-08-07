export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Premium maritime color palette
        maritime: {
          // Deep ocean blues - luxury navy tones
          'midnight': '#0B1426',
          'deep-navy': '#1E3A5F',
          'admiral': '#2C5282',
          'royal': '#3182CE',
          'regatta': '#4299E1',
          
          // Sophisticated accent colors
          'gold': {
            50: '#FFFBF0',
            100: '#FEF5E7',
            200: '#FDE8C7',
            300: '#FBDBA7',
            400: '#F6C577',
            500: '#D69E2E',
            600: '#B7791F',
            700: '#975A16',
            800: '#744210',
            900: '#553209'
          },
          
          // Premium whites and grays
          'pearl': '#FEFEFE',
          'mist': '#F8FAFC',
          'silver': '#E2E8F0',
          'slate': {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A'
          }
        },
        
        // Legacy colors for backward compatibility
        primary: {
          navy: "#1e3a8a",
          blue: "#0284c7",
          red: "#dc2626"
        }
      },
      
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'elegant': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Merriweather', 'serif'],
      },
      
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-md': ['2.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.25', letterSpacing: '0' }],
      },
      
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'elegant': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(65, 153, 225, 0.4)',
        'gold-glow': '0 0 20px rgba(214, 158, 46, 0.3)',
      },
      
      backgroundImage: {
        'maritime-gradient': 'linear-gradient(135deg, #1E3A5F 0%, #2C5282 50%, #3182CE 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D69E2E 0%, #F6C577 100%)',
        'premium-gradient': 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
        'ocean-gradient': 'linear-gradient(180deg, #1E3A5F 0%, #0B1426 100%)',
        'wave-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      
      backdropBlur: {
        'luxury': '20px',
      },
      
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'wave': 'wave 3s ease-in-out infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: []
}