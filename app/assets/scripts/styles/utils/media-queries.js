import { css } from 'styled-components';
import get from 'lodash.get';

const availableRanges = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
const availableBounds = ['Up', 'Only', 'Down'];

/**
 * Create the 'Up', 'Only', and 'Down' options for the given media label.
 * Logs a warning to the console when the use media query makes no sense,
 * switching to the best alternative possible.
 *
 * @param {string} label Media query range label
 */

/**
 * Create the css media query expression, validating the input range and the
 * desired media query bound type (Up, Down, Only)
 * Logs a warning to the console when the use media query makes no sense,
 * switching to the best alternative possible.
 *
 * @param {array} range The media query range [upper, lower] bounds.
 * @param {string} label The media query range label
 * @param {string} type The media query bound type. One of (Up, Down, Only).
 */
function buildMediaExp(range, label, type) {
  const getExpr = ([lower, upper], type) => {
    switch (type) {
      case 'Up':
        // It makes no sense to have a media query "Up" from nothing.
        // There's no need for a media query in that case.
        if (lower === null) return null;
        return `only screen and (min-width: ${lower}px)`;
      case 'Only':
        // This only makes sense when there are both bounds.
        // Otherwise the "Up" or "Down" can be used with the same result.
        if (lower === null || upper === null) return null;
        return `only screen and (min-width: ${lower}px and max-width: ${upper}px)`;
      case 'Down':
        // It makes no sense to have a media query "Down" from infinity.
        // There's no need for a media query in that case.
        if (upper === null) return null;
        return `only screen and (max-width: ${upper}px)`;
    }
  };

  const missingRange =
    range[0] === null ? 'lower' : range[1] === null ? 'upper' : null;

  const expr = getExpr(range, type);

  if (expr === null && (type === 'Up' || type === 'Down')) {
    /* eslint-disable-next-line no-console */
    console.warn(`Media query warning: The specified media query (${label}${type}) has no ${missingRange} bound.
There's no need for a media query in this case;`);
    return null;
  } else if (expr === null) {
    /* eslint-disable-next-line no-console */
    console.warn(`Media query warning: The specified media query (${label}${type}) has no ${missingRange} bound.
You can use (${label}${range[0] === null ? 'Down' : 'Up'}) instead.`);
    return getExpr(range, range[0] === null ? 'Down' : 'Up');
  }

  return expr;
}

/**
 * Create the 'Up', 'Only', and 'Down' options for the given media label.
 *
 * @param {string} label Media query range label
 */
function createMediaRangeBounds(label) {
  return availableBounds.reduce(
    (acc, type) => ({
      ...acc,
      [`${label}${type}`]: (...args) => {
        return (props) => {
          const range = get(props.theme, ['mediaRanges', label]);

          if (!range) {
            /* eslint-disable-next-line no-console */
            console.warn(`Media query warning: Missing bounds for (${label}) range.
Add them to the theme under (mediaRanges: { ${label}: [upper, lower] })`);
          }

          const expr = range ? buildMediaExp(range, label, type) : null;
          return expr
            ? css`
                @media ${expr} {
                  ${css(...args)}
                }
              `
            : css(...args);
        };
      }
    }),
    {}
  );
}

/**
 * Build the media query utility where for each range there is the 'Up', 'Only',
 * and 'Down' options.
 *
 * Available media queries:
 * xsmallDown
 * smallUp, smallOnly, smallDown
 * mediumUp, mediumOnly, mediumDown
 * largeUp, largeOnly, largeDown
 * xlargeUp
 *
 * To use with style components as:
 *
 * @example
 * media.smallOnly`
 *   color: red;
 * `
 */
const media = availableRanges.reduce((acc, label) => {
  return {
    ...acc,
    ...createMediaRangeBounds(label)
  };
}, {});

export default media;
