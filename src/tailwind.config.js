// TODO: move this into src, and then you can use the object to generate your bag color options.....

module.exports = {
  theme: {
    colors: {
      gray: {
        0: '#edebe8',
        1: '#d5d4d0',
        2: '#bcbcb7',
        3: '#a4a59f',
        4: '#8b8e87',
        5: '#73776f',
        6: '#5a5f56',
        7: '#42483e',
      },
      primary: '#9b5c83',
      bags: {
        red: '#c27168',
        orange: '#c88b59',
        yellow: '#c49f47',
        green: '#82ab55',
        teal: '#68b0a1',
        blue: '#70a4b9',
        purple: '#9d7a9a',
        pink: '#ad7499',
        white: '#ffffff',
        black: '#2c3029',
      },
    },
    fontFamily: {
      display: ['Rye', 'serif'],
      body: ['Lato', 'sans-serif'],
    },
    transition: {
      duration: '75ms',
      timingFunction: 'ease-in-out',
    },
  },
  variants: {},
  plugins: [
    function({ addUtilities, config }) {
      const duration = config('theme.transition.duration');
      const timingFunction = config('theme.transition.timingFunction');
      addUtilities({
        '.transition': {
          transition: `all ${duration} ${timingFunction}`,
        },
      });
    },
  ],
};
