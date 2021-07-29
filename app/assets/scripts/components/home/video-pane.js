import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import { saveAs } from 'file-saver';
import styled from 'styled-components';

import { glsp } from '../../styles/utils/theme-values';
import { themeVal } from '../../styles/utils/general';
import Form from '../../styles/form/form';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody
} from '../../styles/form/group';
import { FormHelper, FormHelperMessage } from '../../styles/form/helper';
import FormLabel from '../../styles/form/label';
import FormInput from '../../styles/form/input';
import FormSelect from '../../styles/form/select';
import { headingAlt } from '../../styles/type/heading';

import Button from '../../styles/button/button';

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

const VideoForm = styled(Form)`
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${glsp(0.5, 1)};

  > *:nth-of-type(4),
  > *:nth-of-type(5) {
    grid-row: 3;
  }
`;

// one global for speed
let chunks = [];

export function VideoPaneBody(props) {
  const { scenes, mapboxMapRef, onAction, downloadName, codec, format } = props;

  const [frameRate, setFrameRate] = useState(29.97);
  const [size, setSize] = useState('800x600');

  const frameRates = [24, 29.97, 30, 45, 60];
  const sizes = ['400x300', '600x400', '800x600', '1200x900'];
  const formats = ['mp4', '3gpp'];
  const codecs = ['avc1.4d002a', 'mp4v.20.9']; // in reality, these should be based on the format choice and browser support

  useEffect(() => {
    const canvas = mapboxMapRef.current.getCanvas();
    const videoStream = canvas.captureStream(frameRate);
    const mediaRecorder = new MediaRecorder(videoStream);
    chunks = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

    const video = document.querySelector('video');
    video.style.width = size.split('x')[0];
    video.style.height = size.split('x')[1];

    onAction('video.set.mediarecorder', mediaRecorder);
  }, [frameRate, mapboxMapRef, onAction, size]);

  if (scenes.length !== 2) {
    return <p>Please take 2 shots before exporting</p>;
  }

  return (
    <div>
      <p>
        Keep this pane open to create and export recordings. Note that screen
        size, browser, and computer characteristics can affect video output
        quality
      </p>
      <React.Fragment>
        <PanelSection>
          <PanelSectionTitle>Recording Settings</PanelSectionTitle>
          <VideoForm>
            <FormGroup>
              <FormGroupHeader>
                <FormLabel htmlFor='frame-rate'>Frame Rate</FormLabel>
              </FormGroupHeader>
              <FormGroupBody>
                <FormSelect
                  type='text'
                  size='large'
                  id='frame-rate'
                  value={frameRate}
                  onChange={(e) => {
                    setFrameRate(e.target.value);
                  }}
                >
                  {frameRates.map((fr) => {
                    return <option key={fr}>{fr}</option>;
                  })}
                </FormSelect>
                <FormHelper>
                  <FormHelperMessage>Set the recording fps.</FormHelperMessage>
                </FormHelper>
              </FormGroupBody>
            </FormGroup>
          </VideoForm>
          <VideoForm>
            <FormGroup>
              <FormGroupHeader>
                <FormLabel htmlFor='size'>Video Size</FormLabel>
              </FormGroupHeader>
              <FormGroupBody>
                <FormSelect
                  type='text'
                  size='large'
                  id='size'
                  value={size}
                  onChange={(e) => {
                    setSize(e.target.value);
                  }}
                >
                  {sizes.map((sz) => {
                    return <option key={sz}>{sz}</option>;
                  })}
                </FormSelect>
                <FormHelper>
                  <FormHelperMessage>Set the recording size.</FormHelperMessage>
                </FormHelper>
              </FormGroupBody>
            </FormGroup>
          </VideoForm>
        </PanelSection>
        <PanelSection>
          <PanelSectionTitle>Export Settings</PanelSectionTitle>
          <VideoForm>
            <FormGroup>
              <FormGroupHeader>
                <FormLabel htmlFor='download-name'>Download Name</FormLabel>
              </FormGroupHeader>
              <FormGroupBody>
                <FormInput
                  type='text'
                  size='large'
                  id='download-name'
                  value={downloadName}
                  onChange={(e) => {
                    onAction('video.set.download', e.target.value);
                  }}
                />
                <FormHelper>
                  <FormHelperMessage>
                    Name of the exported file.
                  </FormHelperMessage>
                </FormHelper>
              </FormGroupBody>
            </FormGroup>
          </VideoForm>
          <VideoForm>
            <FormGroup>
              <FormGroupHeader>
                <FormLabel htmlFor='format'>Format</FormLabel>
              </FormGroupHeader>
              <FormGroupBody>
                <FormSelect
                  type='text'
                  size='large'
                  id='format'
                  value={format}
                  onChange={(e) => {
                    onAction('video.set.format', e.target.value);
                  }}
                >
                  {formats.map((fr) => {
                    return <option key={fr}>{fr}</option>;
                  })}
                </FormSelect>
                <FormHelper>
                  <FormHelperMessage>Set the export format.</FormHelperMessage>
                </FormHelper>
              </FormGroupBody>
            </FormGroup>
          </VideoForm>
          <VideoForm>
            <FormGroup>
              <FormGroupHeader>
                <FormLabel htmlFor='codec'>Codec</FormLabel>
              </FormGroupHeader>
              <FormGroupBody>
                <FormSelect
                  type='text'
                  size='large'
                  id='codec'
                  value={codec}
                  onChange={(e) => {
                    onAction('video.set.codec', e.target.value);
                  }}
                >
                  {codecs.map((cd) => {
                    return <option key={cd}>{cd}</option>;
                  })}
                </FormSelect>
                <FormHelper>
                  <FormHelperMessage>Set the export codec.</FormHelperMessage>
                </FormHelper>
              </FormGroupBody>
            </FormGroup>
          </VideoForm>
        </PanelSection>
      </React.Fragment>
    </div>
  );
}

VideoPaneBody.propTypes = {
  scenes: T.array,
  mapboxMapRef: T.object,
  onAction: T.func,
  downloadName: T.string,
  codec: T.string,
  format: T.string
};

export function VideoPaneFooter(props) {
  const {
    scenes,
    isAnimating,
    onAction,
    mediaRecorder,
    format,
    codec,
    downloadName
  } = props;

  const onVideoClick = () => {
    if (isAnimating) {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: `video/${format}; codecs="${codec}"`
        });
        chunks = [];

        const video = document.querySelector('video');
        const videoURL = URL.createObjectURL(blob);
        video.src = videoURL;
        saveAs(blob, `${downloadName}.${format}`);
      };
      onAction('stop');
      mediaRecorder.stop();
    } else {
      onAction('play');
      mediaRecorder.start();
    }
  };

  return (
    <Button
      variation='primary-raised-dark'
      disabled={scenes.length < 2}
      onClick={() => onVideoClick()}
      useIcon={isAnimating ? 'circle-pause' : 'circle-play'}
    >
      {isAnimating ? 'Stop + Export' : 'Play + Record'}
    </Button>
  );
}

VideoPaneFooter.propTypes = {
  scenes: T.array,
  isAnimating: T.bool,
  mediaRecorder: T.object,
  onAction: T.func,
  downloadName: T.string,
  codec: T.string,
  format: T.string
};
