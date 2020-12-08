import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import MetaTags from './meta-tags';
import PageHeader from './page-header';
import PageFooter from './page-footer';
import { reveal } from '../../styles/animation';

import config from '../../config';

const { appTitle, appDescription } = config;

const Page = styled.div`
  display: grid;
  grid-template-rows: minmax(2rem, min-content) 1fr ${({ hideFooter }) =>
      hideFooter ? 0 : 'auto'};
  min-height: 100vh;
`;

const PageBody = styled.main`
  padding: 0;
  margin: 0;

  /* Animation */
  animation: ${reveal} 0.48s ease 0s 1;
`;

function App(props) {
  const { pageTitle, hideFooter, children } = props;
  const title = pageTitle ? `${pageTitle} — ` : '';

  return (
    <Page className='page' hideFooter={hideFooter}>
      <MetaTags title={`${title}${appTitle}`} description={appDescription} />
      <PageHeader />
      <PageBody role='main'>{children}</PageBody>
      <PageFooter />
    </Page>
  );
}

App.propTypes = {
  pageTitle: T.string,
  hideFooter: T.bool,
  children: T.node
};

export default App;
