import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        academy: {
          white: 'var(--white)',
          blue: 'var(--blue)',
          red: 'var(--red)',
          yellow: 'var(--yellow)',
          navy: 'var(--navy)'
        }
      },
      boxShadow: {
        glow: '0 0 30px rgba(29, 78, 216, 0.25)'
      }
    }
  },
  plugins: []
};

export default config;
