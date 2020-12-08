import styled, { css } from 'styled-components';
import { themeVal } from '../utils/general';
import { _rgba } from '../utils/theme-values';

const sizeMapping = {
  xxsmall: '0.75rem',
  xsmall: '1rem',
  small: '1.25rem',
  medium: '1.5rem',
  large: '1.75rem',
  xlarge: '2rem',
  xxlarge: '2.25rem',
  jumbo: '3rem'
};

const lineHeightMapping = {
  xxsmall: '1rem',
  xsmall: '1.25rem',
  small: '1.75',
  medium: '2rem',
  large: '2.25rem',
  xlarge: '2.5rem',
  xxlarge: '2.75rem',
  jumbo: '3.5rem'
};

const getHeadingColor = ({ variation, theme }) => {
  if (variation === 'base') return theme.type.base.color;
  if (variation === 'primary') return theme.color.primary;
  if (variation === 'secondary') return theme.color.secondary;

  return 'inherit';
};

const Heading = styled.h1`
  font-family: ${themeVal('type.base.family')};
  font-weight: ${themeVal('type.heading.weight')};
  margin: 0;

  /* Size and line-height attribute */
  ${({ size }) => `
    font-size: ${sizeMapping[size]};
    line-height: ${lineHeightMapping[size]};
  `}

  /* Colors */
  color:
    ${getHeadingColor};
`;

Heading.defaultProps = {
  size: 'medium'
};

export default Heading;

export const Subheading = styled.h2`
  color: ${_rgba(themeVal('type.base.color'), 0.64)};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-feature-settings: 'pnum' 0; /* Use proportional numbers */
  font-family: ${themeVal('type.base.family')};
  font-weight: ${themeVal('type.heading.regular')};
  text-transform: uppercase;
`;

export const headingAlt = () => css`
  opacity: 0.64;
  color: inherit;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-feature-settings: 'pnum' 0; /* Use proportional numbers */
  font-family: ${themeVal('type.base.family')};
  font-weight: ${themeVal('type.heading.regular')};
  text-transform: uppercase;
`;
