import styled, { css } from 'styled-components';

import { themeVal } from './utils/general';
import { divide, subtract, val2px } from './utils/math';
import { glsp } from './utils/theme-values';
import media from './utils/media-queries';

// Grid:
//   start    1    2    3    4    5    6    7    8    9   10   11   12     end
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
//
// The start and end take up 1 fraction and its size is fluid, depending on
// window size.
// Each column takes up a 12th of the max content width (defined in the theme).
// Grid gaps are marked with an asterisk.

function makeGrid(columns, gap) {
  // Use all the values defined in pixels.
  const layoutMax = val2px(themeVal('layout.max'));
  const gridGap = val2px(glsp(gap));
  // Discard the base padding to ensure that gridded folds have the same size as
  // the constrainers.
  const layoutMaxNoPadding = subtract(layoutMax, gridGap);
  // Each column takes up a 12th of the content block (with is the layoutMaxNoPadding).
  const fullColumn = divide(layoutMaxNoPadding, columns);
  // To get the usable size of each column we need to account for the gap.
  const contentColWidth = subtract(fullColumn, gridGap);

  // Create the columns as:
  // [content-<num>] minmax(0, <size>)
  // Columns start at 2 since the first is named content-start
  const contentColumns = Array(columns - 1)
    .fill(0)
    .map(
      (_, i) => css`
      [content-${i + 2}] minmax(0, ${contentColWidth})
    `
    );

  return css`
    grid-gap: ${glsp(gap)};
    grid-template-columns:
      [full-start] minmax(0, 1fr)
      [content-start] minmax(0, ${contentColWidth})
      ${contentColumns}
      [content-end] minmax(0, 1fr)
      [full-end];
  `;
}

const Gridder = styled.div`
  display: grid;
  ${makeGrid(4, 1)}

  ${media.mediumUp`
    ${makeGrid(8, 2)}
  `}

  ${media.largeUp`
    ${makeGrid(12, 2)}
  `}
`;

export default Gridder;
