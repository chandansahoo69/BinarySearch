module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        100: "26rem",
        45: "45%",
        15: "60px",
        22: "86px",
      },
      width: {
        15: "60px",
      },
      animation: {
        bounce200: "bounce 1s infinite 200ms",
        bounce400: "bounce 1s infinite 400ms",
      },
      colors: {
        "regal-blue": "#243c5a",
        white: "#e6f1ff",
        navy: "#0a192f",
        green: "#64ffda",
        "green-300": "#03ce6f",
        "slate-10": "#a9c5ea",
        "slate-20": "#c3cceb",
        "slate-50": "#cbd5e1",
        "slate-100": "#ccd6f6",
        "slate-200": "#a8b2d1",
        "slate-300": "#8892b0",
        "slate-400": "#495670",
        "dark-navy": "#020c1b",
        "dark-navy-2": "#020c1b",
        "light-navy": "#112240",
        "lightest-navy": "#233554",
        div: "#1e293b",
        button: "#212354",
        light_pink: "#ec4896",
        sky_blue: "#0ea5e9",
        light_yellow: "#fbbf24",
        light_purple: "#c084fc",
        codewar: "#011936",
        codewar_outputdiv: "#0f2149",
        codewar_bluebutton: "#2148dc",
        codewar_bluebuttondark: "#1e2e8c",
        codewar_divbutton: "#2d3c68",
        codewar_hoverdivbutton: "#16306c",
        codewar_separator: "#102742",
        codewar_profilebox: "#0f2149",
        roomcard: "#1e293b",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],

  /**
   * text - 83c5fd
   * text slate - a9c5ea
   *
   *
   */
};
