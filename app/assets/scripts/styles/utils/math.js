import get from 'lodash.get';

import { px, rem } from './general';

/**
 * Creates a math function that performs the given operation taking into account
 * only the unit of the first value. Eg: 2rem * 2 = 4rem | 2 * 2rem = 4
 * The resulting function accepts 2 arguments to which the given operation
 * will be applied.
 * This function is ready to work with styled-components so that any function
 * passed as an argument will receive the component props.
 *
 * @example Simple function
 * const add = createMathOperation('+');
 * add(2, 2) // -> 4
 *
 * @example Using with themeVal()
 * const multiply = createMathOperation('*');
 * multiply(themeVal('globalSpacing'), 2) // -> 2rem
 *
 * @param {string} op Math operation to perform. Can be + - * /
 */
const createMathOperation = (op) => (a, b) => (...args) => {
  a = typeof a === 'function' ? a(...args) : a;
  b = typeof b === 'function' ? b(...args) : b;

  // The final unit is driven by the `a` value.
  const unit = (a + '').match(/[0-9]*(?:.[0-9]+)?(.*)/)[1];
  const aVal = parseFloat(a);
  const bVal = parseFloat(b);

  if (op === '+') {
    return `${aVal + bVal}${unit}`;
  } else if (op === '-') {
    return `${aVal - bVal}${unit}`;
  } else if (op === '/') {
    return `${aVal / bVal}${unit}`;
  } else if (op === '*') {
    return `${aVal * bVal}${unit}`;
  }
};

/**
 * Creates a math function to add values. It takes into account
 * only the unit of the first value. Eg: 2rem + 2 = 4rem | 2 + 2rem = 4
 * This function is ready to work with styled-components so that any function
 * passed as an argument will receive the component props.
 *
 * @param {string} a First value
 * @param {string} b Second value
 */
export const add = createMathOperation('+');

/**
 * Creates a math function to subtract values. It takes into account
 * only the unit of the first value. Eg: 4rem - 2 = 2rem | 4 - 2rem = 2
 * This function is ready to work with styled-components so that any function
 * passed as an argument will receive the component props.
 *
 * @param {string} a First value
 * @param {string} b Second value
 */
export const subtract = createMathOperation('-');

/**
 * Creates a math function to divide values. It takes into account
 * only the unit of the first value. Eg: 4rem / 2 = 2rem | 4 / 2rem = 2
 * This function is ready to work with styled-components so that any function
 * passed as an argument will receive the component props.
 *
 * @param {string} a First value
 * @param {string} b Second value
 */
export const divide = createMathOperation('/');

/**
 * Creates a math function to add values. It takes into account
 * only the unit of the first value. Eg: 2rem * 2 = 4rem | 2 * 2rem = 4
 * This function is ready to work with styled-components so that any function
 * passed as an argument will receive the component props.
 *
 * @param {string} a First value
 * @param {string} b Second value
 */
export const multiply = createMathOperation('*');

/**
 * Convert the given value to the given unit using the base size defined in the
 * theme. (theme.type.base.root) If value is a function will execute it. This
 * allows to use directly in styled-components with themeVal.
 * Only conversion between rem and px is allowed. Any other destination unit
 * will be ignored and the value returned as is.
 *
 * @example
 * rp2rp(themeVal('layout.max'), 'px')
 *
 * @param {mixed} v The value
 * @param {mixed} unit The destination unit
 *
 * @throws Error if the root type pixel value is not defined.
 */
const rp2rp = (v, unit) => (...args) => {
  v = typeof v === 'function' ? v(...args) : v;
  unit = typeof unit === 'function' ? unit(...args) : unit;

  const rootV = get(args[0], 'theme.type.base.root', null);
  if (rootV === null) {
    throw new Error('Root type pixel value not found in theme.type.base.root');
  }

  const srcUnit = (v + '').match(/[0-9]*(?:.[0-9]+)?(.*)/)[1];
  const srcVal = parseFloat(v);

  if (unit === 'px') {
    return srcUnit === 'rem' ? srcVal * parseFloat(rootV) : px(srcVal);
  }

  if (unit === 'rem') {
    return srcUnit === 'px' ? srcVal / parseFloat(rootV) : rem(srcVal);
  }

  // Invalid unit - return as is.
  return v;
};

/**
 * Convert the given value to pixels using the base size defined in the theme.
 * (theme.type.base.root)
 * If value is a function will execute it. This allows to use directly in
 * styled-components with themeVal
 *
 * @see rp2rp()
 *
 * @example
 * val2px(themeVal('layout.max'))
 *
 * @param {mixed} val The value
 *
 * @throws Error if the root type pixel value is not defined.
 */
export const val2px = (val) => {
  return rp2rp(val, 'px');
};

/**
 * Convert the given value to rem using the base size defined in the theme.
 * (theme.type.base.root)
 * If value is a function will execute it. This allows to use directly in
 * styled-components with themeVal
 *
 * @see rp2rp()
 *
 * @example
 * val2rem(themeVal('layout.max'))
 *
 * @param {mixed} val The value
 *
 * @throws Error if the root type pixel value is not defined.
 */
export const val2rem = (val) => {
  return rp2rp(val, 'rem');
};
