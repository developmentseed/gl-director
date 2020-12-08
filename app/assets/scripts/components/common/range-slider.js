import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import InputRange from 'react-input-range';

import {
  FormGroupBody,
  FormGroupHeader,
  FormGroup
} from '../../styles/form/group';
import FormLabel from '../../styles/form/label';

import { visuallyHidden } from '../../styles/helpers';
import { validateRangeNum } from '../../utils/utils';
import StressedFormGroupInput from './stressed-form-group-input';

const FormSliderGroup = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 1rem;
  padding-bottom: 1.25rem;
  grid-template-columns: ${({ isRange }) =>
    isRange ? '3rem 1fr 3rem' : '1fr 3rem'};

  ${FormGroup} {
    grid-gap: 0;
  }

  label {
    ${visuallyHidden()}
  }
`;

function RangeSlider(props) {
  const { min, max, step = 1, id, label, value, onChange } = props;

  const isRange = typeof value === 'object';

  // If the step is less than 1, rescale it to increase precision.
  const rescaleFactor = step < 1 ? 1 / step : 1;
  const scale = (v) => v * rescaleFactor;
  scale.invert = (v) => v / rescaleFactor;
  const scaleValueObject = (value) =>
    isRange
      ? {
          min: scale(value.min),
          max: scale(value.max)
        }
      : scale(value);

  const invertValueObject = (value) =>
    isRange
      ? {
          min: scale.invert(value.min),
          max: scale.invert(value.max)
        }
      : scale.invert(value);

  const rStep = scale(step);
  const rMin = scale(min);
  const rMax = scale(max);
  const rSliderVal = scaleValueObject(value);

  const valueRenderFunction = (v) => v.toString();

  return (
    <FormGroup key={id}>
      <FormGroupHeader>
        <FormLabel htmlFor={`slider-${id}`}>{label}</FormLabel>
      </FormGroupHeader>
      <FormGroupBody>
        <FormSliderGroup isRange={isRange}>
          {isRange && (
            <StressedFormGroupInput
              inputType='number'
              inputSize='small'
              id={`slider-input-min-${id}`}
              name={`slider-input-min-${id}`}
              label='Min value'
              value={valueRenderFunction(value.min)}
              validate={validateRangeNum(min, value.max)}
              onChange={(v) => onChange({ ...value, min: Number(v) }, 'field')}
            />
          )}
          <InputRange
            minValue={rMin}
            maxValue={rMax}
            formatLabel={(value) => scale.invert(value)}
            step={rStep}
            name={`slider-${id}`}
            id={`slider-${id}`}
            value={rSliderVal}
            onChange={(v) => onChange(invertValueObject(v), 'slider')}
          />
          <StressedFormGroupInput
            inputType='number'
            inputSize='small'
            id={`slider-input-max-${id}`}
            name={`slider-input-max-${id}`}
            label='Max value'
            value={
              isRange
                ? valueRenderFunction(value.max)
                : valueRenderFunction(value)
            }
            validate={validateRangeNum(isRange ? value.min : min, max)}
            onChange={(v) =>
              onChange(
                isRange
                  ? {
                      ...value,
                      max: Number(v)
                    }
                  : Number(v),
                'field'
              )
            }
          />
        </FormSliderGroup>
      </FormGroupBody>
    </FormGroup>
  );
}

RangeSlider.propTypes = {
  min: T.number,
  max: T.number,
  step: T.number,
  id: T.string,
  label: T.string,
  value: T.oneOfType([T.object, T.number]),
  onChange: T.func
};

export default RangeSlider;
