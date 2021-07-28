import React from 'react';
import T from 'prop-types';
import { saveAs } from 'file-saver';


import Button from '../../styles/button/button';

export function VideoPaneBody(props) {
  const { scenes } = props;

  if (scenes.length !== 2) {
    return <p>Please take 2 shots before exporting</p>;
  }

  return (
    'Video Settings + Instructions (codec, file ext, name, frame rate, size)'
  );
}

VideoPaneBody.propTypes = {
  scenes: T.array,
  mediaRecorder: T.object
};

export function VideoPaneFooter(props) {
  const {scenes, isAnimating, onAction, mediaRecorder } = props;

  const onVideoClick = () => {
    if (isAnimating) {
      onAction('stop')
      mediaRecorder.stop();
    } else {
      onAction('play')
      mediaRecorder.start();
    }
  };

  return (
    <Button
      variation='primary-raised-dark'
      disabled={scenes.length < 2}
      onClick={() => onVideoClick() }
      useIcon={isAnimating ? 'circle-pause' : 'circle-play'}
    >
      {isAnimating ? 'Stop + Export' : 'Play + Record'}
    </Button>
  );
}

VideoPaneFooter.propTypes = {
  scenes: T.array,
  isAnimating: T.bool,
  mediaRecorder: T.object
};
