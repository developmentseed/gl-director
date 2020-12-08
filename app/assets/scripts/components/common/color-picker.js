import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { CustomPicker } from 'react-color';
import { Saturation, Hue, Alpha } from 'react-color/lib/components/common';

import {
  FormGroupBody,
  FormGroupHeader,
  FormGroup
} from '../../styles/form/group';
import FormLabel from '../../styles/form/label';
import Button from '../../styles/button/button';
import Dropdown from './dropdown';
import ColorSwatch from './color-swatch';

import { themeVal } from '../../styles/utils/general';
import { glsp } from '../../styles/utils/theme-values';

const ButtonColor = styled(Button).attrs({
  variation: 'base-raised-light',
  useIcon: ['chevron-down--small', 'after']
})`
  &,
  > * {
    display: flex;
  }

  &::after {
    margin-left: auto;
  }
`;

function ColorPicker(props) {
  const { id, label, color, onChangeComplete } = props;

  const [colorDraft, setColorDraft] = useState(color);

  useEffect(() => {
    setColorDraft(color);
  }, [color]);

  const onPickerChange = (value) => {
    setColorDraft(value.rgb);
  };

  return (
    <FormGroup>
      <FormGroupHeader>
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </FormGroupHeader>
      <FormGroupBody>
        <Dropdown
          id='controls-cloud'
          alignment='left'
          direction='down'
          triggerElement={(props) => (
            <ButtonColor {...props}>
              <ColorSwatch color={color} />
            </ButtonColor>
          )}
        >
          <PickerElement
            color={colorDraft}
            onChange={onPickerChange}
            onChangeComplete={onChangeComplete}
          />
        </Dropdown>
      </FormGroupBody>
    </FormGroup>
  );
}

ColorPicker.propTypes = {
  id: T.string,
  onChangeComplete: T.func,
  label: T.string,
  color: T.object
};

export default ColorPicker;

const PickerSelf = styled.div`
  display: grid;
  grid-gap: ${glsp(1)};
  grid-template-columns: 1fr;
`;

const PickerSlider = styled.div`
  position: relative;
  height: 0.5rem;
`;

const PickerSaturation = styled.div`
  position: relative;
  height: 5rem;
  width: 100%;
  overflow: hidden;
`;

const PickerSliderPointer = styled.div`
  background-color: #fff;
  box-shadow: 0 -1px 1px 0 ${themeVal('color.baseAlphaC')},
    0 2px 6px 0 ${themeVal('color.baseAlphaD')};
  border: none;
  border-radius: ${themeVal('shape.ellipsoid')};
  width: 1rem;
  height: 1rem;
  margin-top: -0.25rem;
  transform: translate(-50%);
`;

const PickerSaturationPointer = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: ${themeVal('shape.ellipsoid')};
  box-shadow: inset 0 0 0 1px #fff;
  transform: translate(-50%, -50%);
`;

const PickerElement = CustomPicker((props) => {
  // This is used internally by the CustomPicker.
  /* eslint-disable-next-line no-unused-vars */
  const { onChangeComplete, ...rest } = props;

  return (
    <PickerSelf>
      <PickerSaturation>
        <Saturation {...rest} pointer={PickerSaturationPointer} />
      </PickerSaturation>
      <PickerSlider>
        <Hue {...rest} pointer={PickerSliderPointer} />
      </PickerSlider>
      <PickerSlider>
        <Alpha {...rest} pointer={PickerSliderPointer} />
      </PickerSlider>
    </PickerSelf>
  );
});

PickerElement.propTypes = {
  onChangeComplete: T.func
};
