import React from 'react';
import T from 'prop-types';
import { saveAs } from 'file-saver';
import SyntaxHighlighter from 'react-syntax-highlighter';

import { compileExport } from '../../utils/export-template';
import { getAnimationValues } from '../../utils/animate';
import codeStyle from './code-style';

import Button from '../../styles/button/button';

const getExportCode = (scenes) => {
  const start = getAnimationValues(scenes[0]);
  const end = getAnimationValues(scenes[1]);
  return compileExport({
    token: '<-- your token here -->',
    duration: scenes[0].duration,
    start,
    end
  });
};

export function ExportPaneBody(props) {
  const { scenes } = props;

  if (scenes.length !== 2) {
    return <p>Please take 2 shots before exporting</p>;
  }

  const exportCode = getExportCode(scenes);

  return (
    <SyntaxHighlighter language='html' style={codeStyle} showLineNumbers>
      {exportCode}
    </SyntaxHighlighter>
  );
}

ExportPaneBody.propTypes = {
  scenes: T.array
};

export function ExportPaneFooter(props) {
  const { scenes } = props;

  const onSaveClick = () => {
    const code = getExportCode(scenes);
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'mapbox-example.html');
  };

  return (
    <Button
      variation='primary-raised-dark'
      box='block'
      useIcon='download-2'
      disabled={scenes.length < 2}
      onClick={onSaveClick}
    >
      Download code
    </Button>
  );
}

ExportPaneFooter.propTypes = {
  scenes: T.array
};
