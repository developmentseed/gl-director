import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { glsp, _rgba } from '../../styles/utils/theme-values';
import { themeVal } from '../../styles/utils/general';
import collecticon from '../../styles/collecticons';

import { PanelActions } from '../common/panel';
import Heading, { headingAlt } from '../../styles/type/heading';
import Button from '../../styles/button/button';
import ButtonGroup from '../../styles/button/group';
import Form from '../../styles/form/form';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody
} from '../../styles/form/group';
import { FormHelper, FormHelperMessage } from '../../styles/form/helper';
import FormLabel from '../../styles/form/label';
import FormInput from '../../styles/form/input';
import RangeSlider from '../common/range-slider';
import ColorPicker from '../common/color-picker';
import ColorSwatch from '../common/color-swatch';

const PanelSection = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp()};
  padding: ${glsp()};
  margin: ${glsp(-1, -1, 0, -1)};
  box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaC')};

  &:last-child {
    padding-bottom: 0;
    box-shadow: none;
  }
`;

const PanelSectionTitle = styled.h2`
  ${headingAlt}
  font-size: 0.75rem;
  line-height: 1rem;
`;

const SettingsForm = styled(Form)`
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${glsp(0.5, 1)};

  > *:nth-of-type(4),
  > *:nth-of-type(5) {
    grid-row: 3;
  }
`;

const TargetButtonGroup = styled(ButtonGroup)`
  > * {
    flex-grow: 1;
  }
`;

const CameraScenesList = styled.ul`
  position: relative;
  display: grid;
  grid-gap: ${glsp(2)};

  &::before {
    position: absolute;
    content: '';
    background: ${themeVal('color.baseAlphaC')};
    top: 0;
    left: 0.375rem;
    height: 100%;
    width: 0.25rem;
    border-radius: ${themeVal('shape.rounded')};
  }

  li {
    position: relative;
    padding-left: ${glsp(1.25)};
    display: grid;
    grid-gap: ${glsp(0.5)};

    &::before {
      position: absolute;
      content: '';
      background: ${themeVal('color.base')};
      top: 0.625rem;
      left: 0.25rem;
      height: 0.5rem;
      width: 0.5rem;
      border-radius: ${themeVal('shape.ellipsoid')};
      box-shadow: 0 0 0 2px #ffffff;
    }
  }
`;

const CameraPositionSelf = styled.article`
  display: grid;
  grid-gap: ${glsp()};
`;

const CameraPositionHeader = styled.header`
  display: flex;
`;

const CameraPositionHealine = styled.div`
  padding: 0.25rem 0;
`;

const CameraPositionActions = styled.div`
  margin-left: auto;
  padding-left: ${glsp()};
`;

const CameraPositionMedia = styled.a`
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: ${themeVal('shape.rounded')};

  &::before {
    ${collecticon('focus')}
    position: absolute;
    bottom: ${glsp(0.5)};
    left: ${glsp(0.5)};
    line-height: 1rem;
    color: ${_rgba('#fff', 0.8)};
  }

  &::after {
    position: absolute;
    z-index: 4;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaC')};
    pointer-events: none;
  }

  span {
    position: absolute;
    bottom: ${glsp(0.5)};
    left: ${glsp(-1)};
    color: ${_rgba('#fff', 0.8)};
    line-height: 1rem;
    font-size: 0.875rem;
    font-weight: ${themeVal('type.base.bold')};
    opacity: 0;
    transition: all 0.24s ease-in-out;
  }

  &:hover {
    opacity: 1;

    span {
      left: ${glsp(2)};
      opacity: 1;
    }
  }

  img {
    display: block;
    width: 100%;
  }
`;

const CameraPositionBody = styled.div`
  background: transparent;
`;

const CameraPositionDetails = styled.dl`
  display: grid;
  grid-template-columns: max-content min-content;
  grid-gap: ${glsp(0.25, 1)};
  font-size: 0.875rem;
  line-height: 1rem;

  > * {
    margin-bottom: ${glsp(0.25)};
  }

  dd {
    font-weight: ${themeVal('type.base.bold')};
    white-space: nowrap;
  }
`;

const PlaybackButton = styled(Button)`
  min-width: 10rem;
`;

const sliders = [
  {
    min: 0,
    max: 2,
    step: 0.1,
    label: 'Terrain exaggeration',
    propKey: 'exaggeration'
  },
  {
    min: 0,
    max: 90,
    step: 1,
    label: 'Sun altitude',
    propKey: 'sunAltitude'
  },
  {
    min: 0,
    max: 360,
    step: 1,
    label: 'Sun azimuth',
    propKey: 'sunAzimuth'
  }
];

export function CreatePaneBody(props) {
  const { onAction, isSelectingTarget, target, settings, scenes } = props;
  return (
    <React.Fragment>
      <PanelSection>
        <PanelSectionTitle>Target</PanelSectionTitle>
        <TargetButtonGroup>
          <Button
            variation='primary-raised-light'
            onClick={() => onAction('target.selecting')}
            active={isSelectingTarget}
          >
            Set target
          </Button>
          <Button
            variation='primary-raised-light'
            onClick={() => onAction('target.focus')}
            disabled={!target}
          >
            Focus target
          </Button>
          <Button
            variation='primary-raised-light'
            onClick={() => onAction('target.clear')}
            disabled={!target}
          >
            Clear target
          </Button>
        </TargetButtonGroup>
      </PanelSection>

      <PanelSection>
        <PanelSectionTitle>Settings</PanelSectionTitle>
        <SettingsForm>
          {/* Prevent implicit submission of the form */}
          <button
            type='submit'
            disabled
            style={{ display: 'none' }}
            aria-hidden='true'
          />
          {sliders.map((slider) => (
            <RangeSlider
              key={slider.propKey}
              min={slider.min}
              max={slider.max}
              step={slider.step}
              id={slider.propKey}
              label={slider.label}
              value={settings[slider.propKey]}
              onChange={(value) => {
                onAction('settings.set', {
                  prop: slider.propKey,
                  value: value
                });
              }}
            />
          ))}
          <ColorPicker
            label='Sun halo'
            id='sunHalo'
            color={settings.sunHalo}
            onChangeComplete={(v) => {
              onAction('settings.set', {
                prop: 'sunHalo',
                value: v.rgb
              });
            }}
          />
          <ColorPicker
            label='Sun atmosphere'
            id='sunAtmosphere'
            color={settings.sunAtmosphere}
            onChangeComplete={(v) => {
              onAction('settings.set', {
                prop: 'sunAtmosphere',
                value: v.rgb
              });
            }}
          />
        </SettingsForm>
      </PanelSection>

      {!!scenes.length && (
        <PanelSection>
          <PanelSectionTitle>Sequence</PanelSectionTitle>
          <CameraScenesList>
            {scenes.map((pos, idx) => (
              <li key={pos.id}>
                <CameraPosition
                  title={`Shot #${idx + 1}`}
                  image={pos.image}
                  details={pos.settings}
                  onGoToCamera={() => onAction('camera.view', pos)}
                  onEditClick={() => onAction('camera.edit', { idx })}
                />
                {idx < scenes.length - 1 && (
                  <Form>
                    <FormGroup>
                      <FormGroupHeader>
                        <FormLabel htmlFor='transition-duration'>
                          Duration
                        </FormLabel>
                      </FormGroupHeader>
                      <FormGroupBody>
                        <FormInput
                          type='number'
                          size='large'
                          id='transition-duration'
                          value={pos.duration.toString()}
                          onChange={(e) => {
                            onAction('camera.set-duration', {
                              idx,
                              id: pos.id,
                              value: parseInt(e.target.value)
                            });
                          }}
                        />
                        <FormHelper>
                          <FormHelperMessage>
                            Duration of the camera movement is seconds.
                          </FormHelperMessage>
                        </FormHelper>
                      </FormGroupBody>
                    </FormGroup>
                  </Form>
                )}
              </li>
            ))}
          </CameraScenesList>
        </PanelSection>
      )}
    </React.Fragment>
  );
}

CreatePaneBody.propTypes = {
  scenes: T.array,
  onAction: T.func,
  isSelectingTarget: T.bool,
  target: T.array,
  settings: T.object
};

export function CreatePaneFooter(props) {
  const { scenes, onAction, isAnimating } = props;

  return (
    <PanelActions>
      <Button
        variation='primary-raised-light'
        box='block'
        disabled={scenes.length >= 2}
        onClick={() => onAction('camera.add')}
        useIcon='camera'
      >
        Capture shot {scenes.length === 0 ? '#1 of 2' : '#2 of 2'}
      </Button>
      <PlaybackButton
        variation='primary-raised-dark'
        disabled={scenes.length < 2}
        onClick={() => onAction(isAnimating ? 'stop' : 'play')}
        useIcon={isAnimating ? 'circle-pause' : 'circle-play'}
      >
        {isAnimating ? 'Pause' : 'Play'}
      </PlaybackButton>
    </PanelActions>
  );
}

CreatePaneFooter.propTypes = {
  scenes: T.array,
  onAction: T.func,
  isAnimating: T.bool
};

function CameraPosition(props) {
  const { title, image, onGoToCamera, details, onEditClick } = props;

  const { sunHalo, sunAtmosphere, ...otherDetails } = details;

  return (
    <CameraPositionSelf>
      <CameraPositionHeader>
        <CameraPositionHealine>
          <Heading size='xsmall'>{title}</Heading>
        </CameraPositionHealine>
        <CameraPositionActions>
          <Button
            variation='base-plain'
            onClick={onEditClick}
            useIcon='camera'
            title='Reshoot shot'
          >
            Reshoot
          </Button>
        </CameraPositionActions>
      </CameraPositionHeader>
      <CameraPositionMedia
        onClick={(e) => {
          e.preventDefault();
          onGoToCamera();
        }}
      >
        <img src={image} alt='Scene image' />
        <span>View shot</span>
      </CameraPositionMedia>
      <CameraPositionBody>
        <CameraPositionDetails>
          {Object.keys(otherDetails).map((k) => {
            const name = sliders.find((s) => s.propKey === k).label;
            return (
              <React.Fragment key={k}>
                <dt>{name}</dt>
                <dd>{details[k]}</dd>
              </React.Fragment>
            );
          })}
          <dt>Sun halo</dt>
          <dd>
            <ColorSwatch color={sunHalo} />
          </dd>
          <dt>Sun atmosphere</dt>
          <dd>
            <ColorSwatch color={sunAtmosphere} />
          </dd>
        </CameraPositionDetails>
      </CameraPositionBody>
    </CameraPositionSelf>
  );
}

CameraPosition.propTypes = {
  image: T.string,
  title: T.string,
  details: T.object,
  onGoToCamera: T.func,
  onEditClick: T.func
};
