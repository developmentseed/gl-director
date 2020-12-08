import styled, { css } from 'styled-components';

import { visuallyHidden } from './helpers';
import { themeVal } from './utils/general';

import { glsp, _rgba } from './utils/theme-values';
import media from './utils/media-queries';

import Constrainer from './constrainer';

export const Inpage = styled.article`
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr;

  /**
   * Make Inpage map-centric
   *
   * Visually hides inpageHeader and sets the grid layout to a single row.
   * The latter is needed so that inpageBody can be displayed in full height.
   */

  ${({ isMapCentric }) =>
    isMapCentric &&
    css`
      grid-template-rows: 1fr;
      ${InpageHeader} {
        ${visuallyHidden()}
      }
    `}
`;

export const InpageHeader = styled.header`
  box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaC')};

  /* Visually hidden */
  ${({ isHidden }) =>
    isHidden &&
    css`
      ${visuallyHidden()}
    `}
`;

export const InpageHeaderInner = styled(Constrainer)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: ${glsp(1)};
  padding-top: ${glsp(2)};
  padding-bottom: ${glsp(2)};

  ${media.mediumUp`
    padding-top: ${glsp(3)};
    padding-bottom: ${glsp(3)};
    grid-gap: ${glsp(2)};
    grid-template-columns: repeat(8, 1fr);
  `}

  ${media.largeUp`
    padding-top: ${glsp(4)};
    padding-bottom: ${glsp(4)};
    grid-gap: ${glsp(4)} ${glsp(2)};
    grid-template-columns: repeat(12, 1fr);
  `}
`;

export const InpageHeadline = styled.div`
  display: flex;
  flex-flow: column;
  min-width: 0;
  grid-row: 1;
  grid-column: span 4;

  ${media.mediumUp`
    grid-column: span 8;
  `}

  ${media.largeUp`
    grid-column: span 8;
  `}

  > *:last-child {
    margin-bottom: 0;
  }
`;

export const InpageToolbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  grid-row: 2;
  grid-column: 1;

  ${media.mediumUp`
    grid-column: span 8;
  `}

  ${media.largeUp`
    grid-row: 1;
    grid-column: 9 / span 4;
    justify-items: end;
  `}
`;

export const InpageTitle = styled.h1`
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: ${themeVal('type.heading.weight')};
  letter-spacing: -0.025em;
  margin: 0 0 0 -0.125rem;

  ${media.mediumUp`
    font-size: 2.25rem;
    line-height: 2.75rem;
  `}

  ${media.largeUp`
    font-size: 2.5rem;
    line-height: 3rem;
  `}
`;

export const InpageSubtitle = styled.p`
  font-size: 1rem;
  font-weight: ${themeVal('type.base.extrabold')};
  line-height: 1;
  text-transform: uppercase;
  order: -1;
`;

export const InpageBody = styled.div`
  background: transparent;
`;
