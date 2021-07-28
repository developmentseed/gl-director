import React, { useState } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';

import media from '../../styles/utils/media-queries';
import { glsp } from '../../styles/utils/theme-values';
import { themeVal } from '../../styles/utils/general';

import Panel from '../common/panel';
import ShadowScrollbar from '../common/shadow-scrollbar';
import Button from '../../styles/button/button';
import { ExportPaneBody, ExportPaneFooter } from './export-pane';
import { CreatePaneBody, CreatePaneFooter } from './create-pane';
import { VideoPaneBody, VideoPaneFooter } from './video-pane';

const PanelSelf = styled(Panel)`
  ${media.largeUp`
    width: 30rem;
  `}
`;

const BodyScroll = styled(ShadowScrollbar)`
  flex: 1;
  z-index: 1;
`;

const BodyScrollInner = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp()};
  padding: ${glsp()};
`;

const PanelTabs = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: ${glsp(-1)};
  align-items: flex-start;
`;

const PanelTabsList = styled.ul`
  display: grid;
  grid-auto-columns: min-content;
  grid-gap: ${glsp(1.5)};

  li {
    grid-row: 1;
  }
`;

const PanelTabsActions = styled.div`
  margin-top: ${glsp(-0.5)};
  margin-left: auto;
  padding-left: ${glsp()};
`;

const TabLink = styled.a`
  position: relative;
  display: block;
  padding: ${glsp(0, 0, 1, 0)};
  font-size: 0.875rem;
  line-height: 1rem;
  font-weight: ${themeVal('type.base.bold')};

  &,
  &:visited {
    color: inherit;
  }

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    content: '';
    background: ${themeVal('color.link')};
    transition: all 0.16s ease-in-out 0s;

    ${({ active }) =>
      active &&
      css`
        width: 100%;
      `}
  }
`;

const tabs = [
  {
    id: 'create',
    label: 'Create'
  },
  {
    id: 'export',
    label: 'Export'
  },
  {
    id: 'video',
    label: 'Video'
  }
];

function OptionsPanel(props) {
  const {
    onPanelChange,
    revealed,
    cameraPositions,
    settings,
    isAnimating,
    target,
    isSelectingTarget,
    onAction,
    mediaRecorder
  } = props;

  const [activeTab, setActiveTab] = useState('create');

  return (
    <PanelSelf
      collapsible
      direction='right'
      revealed={revealed}
      initialState={revealed}
      onPanelChange={onPanelChange}
      overrideControl
      headerContent={
        <PanelTabs>
          <PanelTabsList>
            {tabs.map((t) => (
              <li key={t.id}>
                <TabLink
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(t.id);
                  }}
                  title='Select tab'
                  active={activeTab === t.id}
                >
                  {t.label}
                </TabLink>
              </li>
            ))}
          </PanelTabsList>
          {activeTab === 'create' && (
            <PanelTabsActions>
              <Button
                variation='base-plain'
                title='Open examples Modal'
                useIcon='folder'
                hideText
                onClick={() => {
                  onAction('examples.click');
                }}
              >
                Open examples Modal
              </Button>
            </PanelTabsActions>
          )}
        </PanelTabs>
      }
      bodyContent={
        <BodyScroll>
          <BodyScrollInner>
            {activeTab === 'export' && (
              <ExportPaneBody scenes={cameraPositions} />
            )}
            {activeTab === 'create' && (
              <CreatePaneBody
                onAction={onAction}
                isSelectingTarget={isSelectingTarget}
                target={target}
                settings={settings}
                scenes={cameraPositions}
              />
            )}
            {activeTab === 'video' && (
              <VideoPaneBody mediaRecorder={mediaRecorder} scenes={cameraPositions}/>
            )

            }
          </BodyScrollInner>
        </BodyScroll>
      }
      footerContent={
        activeTab === 'create' ? (
          <CreatePaneFooter
            scenes={cameraPositions}
            onAction={onAction}
            isAnimating={isAnimating}
          />
        ) : activeTab === 'export' ? (
          <ExportPaneFooter scenes={cameraPositions} onAction={onAction} />
        ) : <VideoPaneFooter
          isAnimating={isAnimating}
          scenes={cameraPositions}
          onAction={onAction}
          mediaRecorder={mediaRecorder}
        />
      }
    />
  );
}

OptionsPanel.propTypes = {
  settings: T.object,
  target: T.array,
  isSelectingTarget: T.bool,
  revealed: T.bool,
  onAction: T.func,
  onPanelChange: T.func,
  isAnimating: T.bool,
  cameraPositions: T.array,
  mediaRecorder: T.object
};

export default OptionsPanel;
