import React from 'react';
import T from 'prop-types';
import { css } from 'styled-components';
import { rgba, shade, tint } from 'polished';

import styled from '../../utils/fancy-styled';
import {
  antialiased,
  visuallyHidden,
  disabled,
  visuallyDisabled
} from '../helpers';
import { themeVal } from '../utils/general';
import collecticon from '../collecticons';

// This empty element is needed so we can use the styled component property
// "forwardedAs" and replace it while maintaining the component structure.
// Because of this, buttons SHOULD NOT be used with "as".
const El = styled.button``;

/* eslint-disable-next-line react/display-name */
const BaseButton = React.forwardRef(({ children, ...rest }, ref) => {
  const elType = rest.type || (!rest.as ? 'button' : undefined);
  return (
    <El ref={ref} {...rest} type={elType}>
      {!!children && <span>{children}</span>}
    </El>
  );
});

BaseButton.propTypes = {
  element: T.oneOfType([T.elementType, T.string]),
  useIcon: T.oneOfType([T.array, T.string]),
  type: T.string,
  children: T.node,
  active: T.bool,
  hideText: T.bool,
  visuallyDisabled: T.bool,
  size: T.string,
  variation: T.string,
  radius: T.string
};

BaseButton.defaultProps = {
  element: 'button',
  type: 'button',
  size: 'medium',
  radius: 'rounded'
};

/**
 * Renders a Button element with a span inide it.
 *
 * @param {string} variation Allows for style variation. (Required) One of:
 *                 base-raised-light
 *                 base-raised-semidark
 *                 base-raised-dark
 *                 base-plain
 *                 primary-raised-light
 *                 primary-raised-semidark
 *                 primary-raised-dark
 *                 primary-plain
 *                 danger-raised-light
 *                 danger-raised-dark
 *                 danger-plain
 *                 achromic-plain
 *                 achromic-glass
 * @param {string} size Allows for size variation. (Optional) One of:
 *                 small
 *                 medium (default)
 *                 large
 *                 xlarge
 * @param {string} radius Allows for border radius variation. (Optional) One of:
 *                 rounded (default)
 *                 ellipsoid
 *                 square
 * @param {string|array} useIcon Allows an icon to be added to the button.
 *                 It can be a string with the icon name which will be added to
 *                 the "before", or an array where the first element is the icon
 *                 name and the second the desired position (before|after).
 */
const Button = styled(BaseButton)`
  ${antialiased()}
  user-select: none;
  display: inline-block;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  line-height: 1.5rem;
  font-size: 1rem;
  padding: 0.25rem 0.75rem;
  min-width: 2rem;
  background: none;
  text-shadow: none;
  border: 0;
  font-family: ${themeVal('type.base.family')};
  font-weight: ${themeVal('type.base.bold')};
  cursor: pointer;

  /* States */

  &,
  &:focus {
    outline: none; /* This causes usability problems. Needs fixing. */
  }

  ${({ visuallyDisabled: vd }) =>
    !vd &&
    css`
      &:hover {
        opacity: 1;
      }
    `}

  ${({ active }) => (active ? '&,' : '')}
  /* stylelint-disable-line */
  &.active,
  &:active {
    z-index: 2;
    transform: none;
  }

  /* Icon handling */

  &::before,
  &::after {
    font-size: 1rem;
  }

  &::before {
    margin-right: 0.375rem;
  }
  &::after {
    margin-left: 0.375rem;
  }

  &::before,
  &::after,
  > * {
    vertical-align: top;
    display: inline-block;
    line-height: inherit !important;
  }

  ${(props) => renderIcon(props)}

  /* Checkbox/radio handling */

  > input[type=checkbox],
  > input[type=radio] {
    ${visuallyHidden()}
  }

  /* Animation */

  transition: background-color 0.24s ease 0s;

  /* Variations */
  ${(props) => renderButtonVariation(props)}

  /* Size */
  ${(props) => renderButtonSize(props)}

  /* Radius */
  ${(props) => renderButtonRadius(props)}

  /* Box */
  ${(props) => renderButtonBox(props)}

  /* Hide Text */
  ${({ hideText }) =>
    hideText &&
    css`
      padding-left: 0;
      padding-right: 0;

      /* stylelint-disable */
      &::before,
      &::after {
        margin: 0;
      }
      /* stylelint-enable */

      > * {
        ${visuallyHidden()}
      }
    `}

  /* Disabled */
  ${({ disabled: dis }) =>
    dis &&
    css`
      ${disabled()}
    `}

  /* Visually Disabled */
  ${({ visuallyDisabled: vd }) =>
    vd &&
    css`
      ${visuallyDisabled()}
    `}
`;

Button.propTypes = {
  children: T.node,
  active: T.bool,
  hideText: T.bool,
  variation: T.string,
  size: T.string,
  radius: T.string
};

export default Button;

// /////////////////////////////////////////////////////////////////////////////
//                                 HELPER FUNCTIONS
// /////////////////////////////////////////////////////////////////////////////

function renderIcon({ useIcon }) {
  if (!useIcon) return;
  const [icon, position] = Array.isArray(useIcon)
    ? useIcon
    : [useIcon, 'before'];

  const selector = `&::${position}`;

  return css`
    ${selector} {
      ${collecticon(icon)}
    }
  `;
}

/**
 * Computes the colors for the given button variation
 *
 * @param {string} color The base color for the button
 * @param {string} style The button style
 * @param {string} brightness The button brightness
 * @param {object} props The element props
 */
function buttonVariationColors(color, style, brightness, { theme }) {
  let textColor = null;
  let bgColor = null;
  let bgColorHover = null;
  let bgColorActive = null;
  let shadowColor = null;

  switch (style) {
    case 'raised':
      switch (brightness) {
        case 'light':
          textColor = color;
          bgColor = tint(1, color);
          bgColorHover = tint(0.96, color);
          bgColorActive = tint(0.92, color);
          shadowColor = rgba(theme.color.base, 0.16);
          break;
        case 'semidark':
          textColor = color;
          bgColor = tint(0.88, color);
          bgColorHover = tint(0.84, color);
          bgColorActive = tint(0.8, color);
          shadowColor = rgba(theme.color.base, 0.16);
          break;
        case 'dark':
          textColor = tint(1, color);
          bgColor = color;
          bgColorHover = shade(0.08, color);
          bgColorActive = shade(0.12, color);
          shadowColor = rgba(theme.color.base, 0.24);
          break;
        default:
          console.error('Invalid brightness property for button raised'); // eslint-disable-line
          break;
      }
      break;
    case 'glass':
      textColor = color;
      bgColor = rgba(color, 0.16);
      bgColorHover = rgba(color, 0.24);
      bgColorActive = rgba(color, 0.32);
      break;
    case 'plain':
      textColor = color;
      bgColor = rgba(color, 0);
      bgColorHover = rgba(color, 0.04);
      bgColorActive = rgba(color, 0.08);
      break;
    default:
      console.error('Invalid style property for button'); // eslint-disable-line
      break;
  }

  return {
    textColor,
    bgColor,
    bgColorHover,
    bgColorActive,
    shadowColor
  };
}

/**
 * Computes the base css for the buttons given color variations
 *
 * @param {string} color The base color for the button
 * @param {string} style The button style
 * @param {string} brightness The button brightness
 * @param {object} props The element props
 */
export function buttonVariationBaseCss(color, style, brightness, { theme }) {
  const { textColor, bgColor, shadowColor } = buttonVariationColors(
    color,
    style,
    brightness,
    { theme }
  );

  return css`
    background-color: ${bgColor};

    &,
    &:visited {
      color: ${textColor};
    }

    ${shadowColor &&
    css`
      box-shadow: 0 -1px 1px 0 ${rgba(theme.color.base, 0.08)},
        0 2px 6px 0 ${shadowColor};
    `}
  `;
}

/**
 * Computes the active css for the buttons given color variations
 *
 * @param {string} color The base color for the button
 * @param {string} style The button style
 * @param {string} brightness The button brightness
 * @param {object} props The element props
 */
export function buttonVariationActiveCss(color, style, brightness, { theme }) {
  const { bgColorActive, shadowColor } = buttonVariationColors(
    color,
    style,
    brightness,
    { theme }
  );

  return css`
    background-color: ${bgColorActive};
    ${shadowColor &&
    css`
      box-shadow: inset 0 1px 2px 0 ${shadowColor};
    `}
  `;
}

/**
 * Computes the hover css for the buttons given color variations
 *
 * @param {string} color The base color for the button
 * @param {string} style The button style
 * @param {string} brightness The button brightness
 * @param {object} props The element props
 */
export function buttonVariationHoverCss(color, style, brightness, { theme }) {
  const { bgColorHover } = buttonVariationColors(color, style, brightness, {
    theme
  });

  return css`
    background-color: ${bgColorHover};
  `;
}

/**
 * Creates the css for a button variation.
 *
 * @param {string} color The base color for the button
 * @param {string} style The button style
 * @param {string} brightness The button brightness
 * @param {object} props The element props
 */
export function buttonVariation(color, style, brightness, props) {
  return css`
    ${buttonVariationBaseCss(color, style, brightness, props)}

    ${({ visuallyDisabled }) =>
      !visuallyDisabled &&
      css`
        /* &.button--hover, */
        &:hover {
          ${buttonVariationHoverCss(color, style, brightness, props)}
        }

        ${({ active }) => (active ? '&, &:hover,' : '')}
        /* stylelint-disable-line */
      &.active,
      &:active {
          ${buttonVariationActiveCss(color, style, brightness, props)}
        }
      `}
  `;
}

/**
 * Renders the correct button variation based on the props.
 *
 * @param {object} props The element props
 */
function renderButtonVariation(props) {
  const { primary, danger, success } = props.theme.color;
  const baseType = props.theme.type.base.color;

  switch (props.variation) {
    case 'primary-raised-light':
      return buttonVariation(primary, 'raised', 'light', props);
    case 'primary-raised-semidark':
      return buttonVariation(primary, 'raised', 'semidark', props);
    case 'primary-raised-dark':
      return buttonVariation(primary, 'raised', 'dark', props);
    case 'primary-plain':
      return buttonVariation(primary, 'plain', 'light', props);

    case 'danger-raised-light':
      return buttonVariation(danger, 'raised', 'light', props);
    case 'danger-raised-dark':
      return buttonVariation(danger, 'raised', 'dark', props);
    case 'danger-plain':
      return buttonVariation(danger, 'plain', 'light', props);

    case 'success-raised-light':
      return buttonVariation(success, 'raised', 'light', props);
    case 'success-raised-dark':
      return buttonVariation(success, 'raised', 'dark', props);
    case 'success-plain':
      return buttonVariation(success, 'plain', 'light', props);

    case 'achromic-plain':
      return buttonVariation('#fff', 'plain', null, props);
    case 'achromic-glass':
      return buttonVariation('#fff', 'glass', null, props);

    case 'base-raised-light':
      return buttonVariation(baseType, 'raised', 'light', props);
    case 'base-raised-semidark':
      return buttonVariation(baseType, 'raised', 'semidark', props);
    case 'base-raised-dark':
      return buttonVariation(baseType, 'raised', 'dark', props);
    case 'base-plain':
    default:
      return buttonVariation(baseType, 'plain', 'light', props);
  }
}
/**
 * Renders the correct border radius based on the props.
 *
 * @param {object} props The element props
 */
function renderButtonRadius(props) {
  switch (props.radius) {
    case 'ellipsoid':
      return css`
        border-radius: ${themeVal('shape.ellipsoid')};
      `;
    case 'square':
      return css`
        border-radius: 0;
      `;
    default:
      return css`
        border-radius: ${themeVal('shape.rounded')};
      `;
  }
}

/**
 * Renders the correct box model based on the props.
 *
 * @param {object} props The element props
 */
function renderButtonBox(props) {
  switch (props.box) {
    case 'block':
      return css`
        display: block;
        width: 100%;
      `;
    case 'semi-fluid':
      return css`
        display: inline-flex;
        min-width: 16rem;
      `;
    default:
      return css`
        display: inline-block;
      `;
  }
}

/**
 * Renders the correct button size based on the props.
 *
 * @param {object} props The element props
 */
function renderButtonSize(props) {
  switch (props.size) {
    // Small (24px)
    case 'small':
      return css`
        line-height: 1.25rem;
        font-size: 0.875rem;
        padding: 0.125rem 0.25rem;
        min-width: 1.5rem;
      `;
    case 'large':
      return css`
        line-height: 1.5rem;
        font-size: 1rem;
        padding: 0.5rem 1.25rem;
        min-width: 2.5rem;
      `;
    case 'xlarge':
      return css`
        line-height: 2rem;
        font-size: 1rem;
        padding: 0.5rem 1.5rem;
        min-width: 3rem;
      `;
    // Medium (32px)
    default:
      return css`
        line-height: 1.5rem;
        font-size: 1rem;
        padding: 0.25rem 0.75rem;
        min-width: 2rem;
      `;
  }
}
