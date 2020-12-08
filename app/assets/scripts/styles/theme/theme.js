import { rgba } from 'polished';

let color = {
  baseLight: '#FFFFFF',
  baseDark: '#443F3F',
  primary: '#CF3F02',
  secondary: '#E2C044',
  tertiary: '#4DA167',
  quaternary: '#3AB795'
};

color = {
  ...color,
  base: color.baseDark,
  background: color.baseLight,
  surface: color.baseLight,
  link: color.primary,
  danger: color.primary,
  warning: color.secondary,
  success: color.tertiary,
  info: color.primary
};

color = {
  ...color,
  baseAlphaA: rgba(color.base, 0.02),
  baseAlphaB: rgba(color.base, 0.04),
  baseAlphaC: rgba(color.base, 0.08),
  baseAlphaD: rgba(color.base, 0.16),
  baseAlphaE: rgba(color.base, 0.32),
  silkLight: `radial-gradient(farthest-side, ${color.baseLight}, ${rgba(
    color.baseLight,
    0.64
  )})`,
  silkDark: `radial-gradient(farthest-side, ${color.baseDark}, ${rgba(
    color.baseDark,
    0.64
  )})`
};

const type = {
  base: {
    root: '16px',
    size: '1rem',
    line: '1.5',
    color: color.base,
    family: '"Open Sans", sans-serif',
    style: 'normal',
    settings: 'normal',
    case: 'none',
    light: 300,
    regular: 400,
    medium: 600,
    bold: 700,
    weight: 300,
    antialiasing: true
  },
  heading: {
    family: '"Open Sans", sans-serif',
    style: 'normal',
    settings: 'normal',
    case: 'none',
    light: 300,
    regular: 400,
    medium: 600,
    bold: 700,
    weight: 700,
    textTransform: 'none'
  },
  button: {
    family: '"Open Sans", sans-serif',
    style: 'normal',
    settings: 'normal',
    case: 'none',
    weight: 700
  }
};

const shape = {
  rounded: '0.25rem',
  ellipsoid: '320rem'
};

const layout = {
  space: '1rem',
  border: '1px',
  min: '320px',
  max: '1280px'
};

const boxShadow = {
  inset: `inset 0px 0px 3px 0px ${color.baseAlphaA};`,
  input: `0 -1px 1px 0 ${color.baseAlphaC}, 0 2px 6px 0 ${color.baseAlphaD};`,
  elevationA: `0 0 4px 0 ${color.baseAlphaC}, 0 2px 2px 0 ${color.baseAlphaC};`,
  elevationB: `0 0 4px 0 ${color.baseAlphaC}, 0 4px 4px 0 ${color.baseAlphaC};`,
  elevationC: `0 0 4px 0 ${color.baseAlphaC}, 0 8px 12px 0 ${color.baseAlphaC};`,
  elevationD: `0 0 4px 0 ${color.baseAlphaC}, 0 12px 24px 0 ${color.baseAlphaC};`
};

const mediaRanges = {
  xsmall: [null, 543],
  small: [544, 767],
  medium: [768, 991],
  large: [992, 1199],
  xlarge: [1216, null]
};

export default {
  main: {
    layout,
    color,
    type,
    shape,
    boxShadow,
    mediaRanges
  }
};
