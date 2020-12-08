import { css } from 'styled-components';
import { themeVal } from './utils/general';

export const stackSkin = () => css`
  background-color: ${themeVal('color.surface')};
  box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaC')};
`;

export const cardSkin = () => css`
  border-radius: ${themeVal('shape.rounded')};
  background-color: ${themeVal('color.surface')};
  box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaC')};
`;

export const panelSkin = () => css`
  background-color: ${themeVal('color.surface')};
  box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaC')};
`;

export const surfaceElevatedD = () => css`
  background-color: ${themeVal('color.surface')};
  box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaC')},
    0 0 16px 2px ${themeVal('color.baseAlphaC')};
`;
