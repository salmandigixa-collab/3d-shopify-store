module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#070b12',
        panel: '#101821',
        accent: '#7cf3d0',
        ember: '#ff8b5e',
        mist: '#dfe7f2'
      },
      boxShadow: {
        glow: '0 0 40px rgba(124, 243, 208, 0.35)'
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at center, rgba(255,255,255,.08) 0, rgba(255,255,255,.02) 1px, transparent 1px)',
        aurora: 'radial-gradient(circle at top left, rgba(124,243,208,.25), transparent 40%), radial-gradient(circle at bottom right, rgba(255,139,94,.2), transparent 35%)'
      }
    }
  },
  plugins: []
};
