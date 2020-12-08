import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import Dropdown from './dropdown';
import Button, { buttonVariationHoverCss } from '../../styles/button/button';
import { FormSwitch } from '../../styles/form/switch';

import { headingAlt } from '../../styles/type/heading';
import { themeVal } from '../../styles/utils/general';
import { glsp, _rgba } from '../../styles/utils/theme-values';

const DropTitle = styled.h6`
  ${headingAlt()}
  color: ${_rgba(themeVal('type.base.color'), 0.64)};
  font-size: 0.75rem;
  line-height: 1rem;
  margin: ${glsp(0, 0, 1, 0)};
`;

const LayersList = styled.ul`
  list-style: none;
  margin: ${glsp(0, -1)};
  padding: 0;

  > li {
    padding: ${glsp(0.5, 1)};
    box-shadow: 0 ${themeVal('layout.border')} 0 0
      ${themeVal('color.baseAlphaC')};
  }

  > li:first-child {
    padding-top: 0;
  }

  > li:last-child {
    padding-bottom: 0;
    box-shadow: none;
  }

  > li > *:last-child {
    margin-bottom: 0;
  }
`;

const LayerSwitch = styled(FormSwitch)`
  display: grid;
  grid-template-columns: 1fr auto;
`;

// Why you ask? Very well:
// Mapbox's css has an instruction that sets the hover color for buttons to
// near black. The only way to override it is to increase the specificity and
// we need the button functions to get the correct color.
// The infamous instruction:
// .mapboxgl-ctrl button:not(:disabled):hover {
//   background-color: rgba(0, 0, 0, 0.05);
// }
const LayersButton = styled(Button)`
  &&&:hover {
    ${({ theme }) =>
      buttonVariationHoverCss(theme.type.base.color, 'raised', 'light', {
        theme
      })}
  }
`;

// React component for the style control.
// It is disconnected from the global state because it needs to be included
// via the mapbox code.
function StyleControlDropdown(props) {
  const { styles, activeStyleId, onChange } = props;

  return (
    <Dropdown
      triggerElement={(bag) => (
        <LayersButton
          {...bag}
          variation='base-raised-light'
          useIcon='iso-stack'
          hideText
        >
          Select map style
        </LayersButton>
      )}
      direction='down'
      alignment='left'
    >
      <DropTitle>Map styles</DropTitle>
      <LayersList>
        {styles.map((style) => {
          return (
            <li key={style.id}>
              <LayerSwitch
                name={`switch-${style.id}`}
                title='Change style'
                checked={activeStyleId === style.id}
                onChange={() => onChange(style.id)}
              >
                {style.label}
              </LayerSwitch>
            </li>
          );
        })}
      </LayersList>
    </Dropdown>
  );
}

StyleControlDropdown.propTypes = {
  styles: T.array,
  activeStyleId: T.string,
  onChange: T.func
};

export default StyleControlDropdown;
