import styled, { css } from 'styled-components';
import { themeVal } from './utils/general';
import { divide } from './utils/math';

const dividerVariation = ({ variation }) => {
  if (variation === 'light') {
    return css`
      background: transparent
        linear-gradient(
          90deg,
          ${themeVal('color.surface')},
          ${themeVal('color.surface')}
        )
        50% / ${themeVal('layout.border')} auto no-repeat;
    `;
  }
  if (variation === 'dark') {
    return css`
      background: transparent
        linear-gradient(
          90deg,
          ${themeVal('color.base')},
          ${themeVal('color.base')}
        )
        50% / ${themeVal('layout.border')} auto no-repeat;
    `;
  }
};

export const HorizontalDivider = styled.hr`
  display: inline-flex;
  border: 0;
  min-width: 8rem;
  height: ${divide(themeVal('layout.space'), 2)};
  opacity: 0.12;
  background: transparent
    linear-gradient(transparent, ${themeVal('color.base')}, transparent) 50% /
    auto ${themeVal('layout.border')} repeat-x;
`;

export const VerticalDivider = styled.hr`
  ${dividerVariation}
  display: inline-flex;
  border: 0;
  width: ${divide(themeVal('layout.space'), 2)};
  height: 2rem;
  margin: 0;
  opacity: 0.08;
`;
