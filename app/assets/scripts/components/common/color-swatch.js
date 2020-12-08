import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';

import { themeVal } from '../../styles/utils/general';
import { glsp } from '../../styles/utils/theme-values';

const ColorSwatchSelf = styled.div`
  display: flex;
  align-items: center;

  &::before {
    display: block;
    content: '';
    width: 0.75rem;
    height: 0.75rem;
    margin-right: ${glsp(0.5)};
    border-radius: ${themeVal('shape.ellipsoid')};
    background: ${({ hexColor }) => hexColor};
    box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaC')};
  }
`;

function ColorSwatch(props) {
  const { color, className } = props;

  const { r, g, b, a } = color;
  const toHex = (v) => {
    const s = v.toString(16);
    return s.length === 1 ? `0${s}` : s;
  };
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  return (
    <ColorSwatchSelf hexColor={hex} className={className}>
      {hex.toUpperCase()} %{a * 100}
    </ColorSwatchSelf>
  );
}

ColorSwatch.propTypes = {
  className: T.string,
  color: T.object
};

export default ColorSwatch;
