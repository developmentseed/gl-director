import React from 'react';
import styled, { css } from 'styled-components';
import { PropTypes as T } from 'prop-types';

import Heading from './type/heading';

import { themeVal } from './utils/general';
import { glsp } from './utils/theme-values';

export const headingDash = (mtop, mbottom) => css`
  &::before {
    content: '';
    display: block;
    background: ${({ dashColor }) => dashColor};
    height: ${glsp(1 / 4)};
    width: ${glsp(2)};
    border-radius: ${themeVal('shape.ellipsoid')};
    margin: ${mtop} 0 ${mbottom} 0;
  }
`;

const Suptitle = styled.p`
  font-size: 1rem;
  font-weight: ${themeVal('type.heading.bold')};
`;

const IntroTitle = styled(Heading)`
  display: flex;
  flex-flow: column nowrap;
  letter-spacing: -0.016em;

  ${headingDash(glsp(0.5), glsp())}
`;

function InpageHGroupCmp({
  suptitle,
  title,
  dashColor,
  size,
  as,
  className,
  wrapperEl: WEl
}) {
  return (
    <WEl className={className}>
      <Suptitle>{suptitle}</Suptitle>
      <IntroTitle dashColor={dashColor} size={size} as={as}>
        {title}
      </IntroTitle>
    </WEl>
  );
}

InpageHGroupCmp.propTypes = {
  className: T.string,
  suptitle: T.string,
  title: T.string.isRequired,
  dashColor: T.oneOfType([T.string, T.func]),
  size: T.string,
  as: T.string,
  wrapperEl: T.string
};

InpageHGroupCmp.defaultProps = {
  dashColor: themeVal('color.primary'),
  size: 'xlarge',
  wrapperEl: 'header'
};

const InpageHGroup = styled(InpageHGroupCmp)`
  /* Export styled to be treated as a styled component */
`;

export default InpageHGroup;
