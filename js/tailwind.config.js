/* Konfiguracja Tailwind (Play CDN) – kolory zaczerpnięte z logo Safari.
 * Ładowana zaraz po <script src="https://cdn.tailwindcss.com/...">. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        cream: '#FBF6EE',
        plum: {
          50: '#F8F2F9', 100: '#F0E4F2', 200: '#E0C8E4', 300: '#C7A0CE', 400: '#A574AF',
          500: '#82508D', 600: '#6A3D75', 700: '#552D5F', 800: '#45244D', 900: '#341B3A', 950: '#221126',
          DEFAULT: '#552D5F',
        },
        lagoon: { 50: '#F0F6F5', 100: '#DDEBE9', 200: '#BCD7D4', 500: '#6C9C98', 600: '#57827E', 700: '#456865', DEFAULT: '#6C9C98' },
        sun:    { 50: '#FDF7EC', 100: '#FAEBCF', 200: '#F4D69E', 500: '#E2A643', 600: '#C98A26', 700: '#9E6A1C', DEFAULT: '#E2A643' },
        ember:  { 50: '#FDF1EC', 100: '#FADFD4', 200: '#F4BCA7', 500: '#DE6537', 600: '#C24F24', 700: '#9B3E1D', DEFAULT: '#DE6537' },
        leaf:   { 50: '#F0F5EF', 100: '#DCE8DA', 200: '#B8D0B4', 500: '#4A7043', 600: '#3D5D37', 700: '#314A2C', DEFAULT: '#4A7043' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(30px,-40px) scale(1.08)' },
          '66%': { transform: 'translate(-25px,20px) scale(0.95)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        blob: 'blob 14s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(34 17 38 / 0.78)',
            '--tw-prose-headings': theme('colors.plum.800'),
            '--tw-prose-bold': theme('colors.plum.800'),
            '--tw-prose-links': theme('colors.plum.700'),
            '--tw-prose-bullets': theme('colors.ember.500'),
            'h2, h3': { fontFamily: theme('fontFamily.display').join(','), fontWeight: '800' },
            'li::marker': { fontSize: '1.1em' },
          },
        },
      }),
    },
  },
  plugins: [
    function ({ addBase, addComponents }) {
      addBase({
        body: { '@apply bg-cream font-sans text-plum-950 antialiased selection:bg-sun-200 selection:text-plum-900': {} },
      });
      addComponents({
        '.container-x': { '@apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8': {} },
        '.btn': {
          '@apply inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold tracking-wide transition duration-200 focus-visible:outline-none focus-visible:ring-4': {},
        },
        '.btn-primary': {
          '@apply bg-plum-700 text-white shadow-lg shadow-plum-700/25 hover:-translate-y-0.5 hover:bg-plum-800 hover:shadow-xl focus-visible:ring-plum-300': {},
        },
        '.btn-sun': {
          '@apply bg-sun text-plum-950 shadow-lg shadow-sun/30 hover:-translate-y-0.5 hover:bg-sun-200 focus-visible:ring-sun-200': {},
        },
        '.btn-ghost': {
          '@apply bg-white/70 text-plum-800 ring-1 ring-plum-900/10 backdrop-blur hover:-translate-y-0.5 hover:bg-white focus-visible:ring-plum-200': {},
        },
        '.btn-ghost-dark': {
          '@apply bg-white/10 text-white ring-1 ring-white/25 hover:-translate-y-0.5 hover:bg-white/20 focus-visible:ring-white/40': {},
        },
        '.nav-link': {
          '@apply rounded-full px-3 py-2 transition hover:bg-plum-50 hover:text-plum-700 xl:px-4': {},
        },
        '.eyebrow': {
          '@apply inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-ember-600': {},
        },
        '.section-title': {
          '@apply font-display text-4xl font-black leading-[1.05] tracking-tight text-plum-800 sm:text-5xl': {},
        },
        '.card': {
          '@apply rounded-3xl bg-white ring-1 ring-plum-900/5 shadow-sm': {},
        },
        '.reveal-init': { opacity: '0', transform: 'translateY(28px)' },
        '.reveal-in': {
          opacity: '1',
          transform: 'none',
          transition: 'opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1)',
        },
        '.no-scrollbar': { scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } },
      });
    },
  ],
};
