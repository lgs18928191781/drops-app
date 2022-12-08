/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,vue,jsx}'],
  theme: {
    spacing: {
      px: '1PX',
      0: '0',
      0.5: '2PX',
      0.75: '3PX',
      1: '4PX',
      1.25: '5PX',
      1.5: '6PX',
      2: '8PX',
      2.5: '10PX',
      3: '12PX',
      3.5: '14PX',
      3.75: '15PX',
      4: '16PX',
      4.5: '18PX',
      5: '20PX',
      6: '24PX',
      7: '28PX',
      7.5: '30PX',
      8: '32PX',
      8.5: '34PX',
      9: '36PX',
      10: '40PX',
      11: '44PX',
      12: '48PX',
      13.5: '54PX',
      14: '56PX',
      15: '60PX',
      16: '64PX',
      14: '56PX',
      15: '60PX',
      16: '64PX',
      17.5: '70PX',
      18: '72PX',
      20: '80PX',
      22: '88PX',
      22.5: '90PX',
      24: '96PX',
      27: '108PX',
      28: '112PX',
      30: '120PX',
      32: '128PX',
      36: '144PX',
      40: '160PX',
      44: '176PX',
      45: '180PX',
      48: '192PX',
      50: '200PX',
      52: '208PX',
      56: '224PX',
      60: '240PX',
      64: '256PX',
      72: '288PX',
      78: '312PX',
      80: '320PX',
      90: '360PX',
      96: '384PX',
      105: '420PX',
      108: '432PX',
      114: '456PX',
      148: '592PX',
    },
    fontSize: {
      xxs: ['10PX', '14PX'],
      xs: ['12PX', '16PX'],
      xsm: ['13PX', '19PX'],
      sm: ['14PX', '20PX'],
      base: ['16PX', '22PX'],
      lg: ['18PX', '26PX'],
      xl: ['20PX', '28PX'],
      '2xl': ['24PX', '32PX'],
      '3xl': ['30PX', '36PX'],
      '4xl': ['36PX', '40PX'],
      '5xl': ['48PX', '48PX'],
      '6xl': ['64PX', '64PX'],
    },
    borderWidth: {
      DEFAULT: '1PX',
      '0': '0',
      '2': '2PX',
      '3': '3PX',
      '4': '4PX',
      '5': '5PX',
      '6': '6PX',
      '8': '8PX',
    },
    borderRadius: {
      none: '0',
      sm: '2PX',
      DEFAULT: '4PX',
      md: '6PX',
      lg: '8PX',
      xl: '12PX',
      '2xl': '16PX',
      '3xl': '24PX',
      full: '9999PX',
    },
    extend: {
      colors: {
        primary: '#FFDC51',
        link: '#5586BB',
        dark: {
          100: '#F5F7FA',
          200: '#EDEFF2',
          250: '#BFC2CC',
          300: '#909399',
          400: '#606266',
          800: '#303133',
        },
      },
      lineHeight: {
        'kinda-loose': '1.83',
      },

      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
        'wiggle-subtle': {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        'bounce-subtle': {
          '0%, 100%': {
            transform: 'translateY(-10%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },

      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        'spin-once': 'spin 1s linear',
        'wiggle-subtle': 'wiggle-subtle 1s ease-in-out infinite',
        'wiggle-subtle-once': 'wiggle-subtle 1s ease-in-out',
        'bounce-subtle': 'bounce-subtle 1s infinite',
      },
    },
  },
  plugins: [require('@headlessui/tailwindcss')({ prefix: 'ui' })],
}
