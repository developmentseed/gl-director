import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';

import { visuallyHidden, disabled as disabledHelper } from '../helpers';
import { themeVal } from '../utils/general';
import {
  buttonVariationHoverCss,
  buttonVariationBaseCss
} from '../button/button';
import collecticon from '../collecticons';
import { _rgba } from '../utils/theme-values';

/**
 * Renders a FormSwitch component.
 * Under the hood this uses a checkbox
 *
 * @param {string} name (html prop) name to be used as `name` and `id` prop
 *                      of the checkbox.
 * @param {string} title (html prop) Label's title attribute
 * @param {boolean} checked Whether or not the FormSwitch is checked
 * @param {func} onChange Change callbalck for the FormSwitch
 * @param {node} children Content of the label
 * @param {boolean} hideText Whether or not to visually hide the FormSwitch text
 * @param {string} textPlacement Where to position the text. `left` or `right`
 *                  of the toggle.
 */
const FormSwitchElement = (props) => {
  const {
    children,
    name,
    title,
    disabled,
    checked,
    onChange,
    className,
    hideText,
    textPlacement
  } = props;

  return (
    <FormOptionLabel
      htmlFor={name}
      className={className}
      title={title}
      disabled={disabled}
    >
      <input
        disabled={disabled}
        type='checkbox'
        name={name}
        id={name}
        value='on'
        checked={checked}
        onChange={onChange}
      />
      {textPlacement === 'right' && <FormOptionUi />}
      <FormOptionText hideText={hideText}>{children}</FormOptionText>
      {textPlacement === 'left' && <FormOptionUi />}
    </FormOptionLabel>
  );
};

FormSwitchElement.propTypes = {
  name: T.string,
  textPlacement: T.string,
  className: T.string,
  title: T.string,
  disabled: T.bool,
  checked: T.bool,
  hideText: T.bool,
  children: T.node,
  onChange: T.func
};

FormSwitchElement.defaultProps = {
  textPlacement: 'left'
};

/**
 * Form option extend. Common code to all form options.
 */
const formOption = css`
  display: inline-grid;
  grid-template-columns: 1fr;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  grid-gap: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  cursor: pointer;

  input {
    flex: none;
    margin-top: 0.3125rem; /* 5px */
  }
`;

const FormOptionLabel = styled.label`
  ${({ disabled }) => disabled && disabledHelper()}
`;

const FormOptionText = styled.span`
  line-height: 1.5;
  ${({ hideText }) => hideText && visuallyHidden()}
`;

const FormOptionUi = styled.span`
  flex: none;
  position: relative;
  transition: all 0.16s ease 0s;
`;

export const FormSwitch = styled(FormSwitchElement)`
  ${formOption}

  input {
    ${visuallyHidden()}
  }

  ${FormOptionUi} {
    margin: 0.25rem 0;
    width: 2.25rem;
    height: 1rem;
    border-radius: ${themeVal('shape.ellipsoid')};
    background: ${_rgba(themeVal('color.base'), 0.48)};
    box-shadow: inset 0 0 0 ${themeVal('layout.border')}
      ${themeVal('color.baseAlphaC')};

    &::before {
      ${(props) =>
        buttonVariationBaseCss(
          props.theme.type.base.color,
          'raised',
          'light',
          props
        )}
      position: absolute;
      z-index: 2;
      top: 50%;
      left: 0;
      content: '';
      height: 1.25rem;
      width: 1.25rem;
      border-radius: ${themeVal('shape.ellipsoid')};
      transform: translate(0, -50%);
      transition: all 0.24s ease 0s;
    }

    &::after {
      ${collecticon('eye-disabled')}
      position: absolute;
      z-index: 1;
      top: 50%;
      left: 100%;
      transform: translate(-100%, -50%);
      transition: all 0.24s ease 0s;
      width: 1.25rem;
      text-transform: uppercase;
      font-size: 0.75rem;
      font-weight: ${themeVal('type.base.bold')};
      line-height: 1;
      color: ${themeVal('color.baseLight')};
      text-align: center;
      opacity: 0;
    }
  }

  &:hover ${/* sc-selector */ FormOptionUi}::before {
    ${(props) =>
      buttonVariationHoverCss(
        props.theme.type.base.color,
        'raised',
        'light',
        props
      )}
  }

  ${({ checked }) => (checked ? `${FormOptionUi},` : '')}
  input:checked ~ ${FormOptionUi} {
    /* stylelint-disable-line */
    background: ${themeVal('color.link')};

    &::before {
      left: 100%;
      transform: translate(-100%, -50%);
    }

    &::after {
      ${collecticon('eye')}
      left: 0;
      transform: translate(0, -50%);
    }
  }
`;
