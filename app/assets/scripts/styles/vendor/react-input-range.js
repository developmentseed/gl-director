import { css } from 'styled-components';

import { buttonVariation } from '../button/button';
import { themeVal, rem } from '../utils/general';
import { disabled } from '../helpers';

// Some dependencies include styles that must be included.
// This file overrides to be used the default react-input-range styles.

const sliderSize = 1.25;
const trackHeight = 0.5;

export default () => css`
  .input-range__slider {
    ${(props) =>
      buttonVariation(props.theme.type.base.color, 'raised', 'light', props)}
    /* background: none; */
    border: none;
    width: ${rem(sliderSize)};
    height: ${rem(sliderSize)};
    margin-left: ${rem(sliderSize / -2)};
    margin-top: ${rem(sliderSize / -2 + trackHeight / -2)};

    &:active {
      transform: none;
    }

    &:focus {
      box-shadow: none;
    }

    .input-range--disabled & {
      background: none;
      border: none;
      box-shadow: none;
      transform: none;
      ${disabled()}
    }
  }

  .input-range__label--value {
    display: none;
  }

  .input-range__track {
    height: 0.5rem;

    &--active {
      background: ${themeVal('color.primary')};
    }
  }
`;
