import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

import config from '../../config';
import { visuallyHidden } from '../../styles/helpers';
import { themeVal } from '../../styles/utils/general';
import { reveal } from '../../styles/animation';
import { glsp, _rgba } from '../../styles/utils/theme-values';
import media from '../../styles/utils/media-queries';
import { headingAlt } from '../../styles/type/heading';

import Button from '../../styles/button/button';

const { appTitle } = config;

const PageHead = styled.header`
  position: relative;
  z-index: 20;
  background: ${themeVal('color.surface')};
  box-shadow: ${themeVal('boxShadow.elevationC')};

  /* Animation */
  animation: ${reveal} 0.32s ease 0s 1;
`;

const PageHeadInner = styled.div`
  display: flex;
  padding: ${glsp(0.75, 1)};
  align-items: center;
  margin: 0 auto;
  height: 100%;

  ${media.largeUp`
    padding: ${glsp(0.75)};
  `}
`;

const PageHeadline = styled.div`
  display: grid;
  grid-gap: ${glsp(0.5)};
  align-items: center;
  padding-right: ${glsp()};
  margin-right: auto;

  > * {
    grid-row: 1;
  }
`;

const PageTitle = styled.h1`
  font-size: 1rem;
  line-height: 1;
  margin: 0;

  ${media.largeUp`
    font-size: 1.25rem;
    line-height: 1;
  `}

  a,
  a:visited {
    color: inherit;
  }
`;

const PageSubtitle = styled.p`
  font-size: 0.875rem;
  line-height: 1rem;
  display: none;
  padding-left: ${glsp(0.5)};
  box-shadow: inset 1px 0 0 0 ${themeVal('color.baseAlphaD')};

  ${media.largeUp`
    display: block;
  `}

  a {
    font-weight: ${themeVal('type.base.bold')};
    color: inherit;
  }
`;

const PageNav = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  background: ${themeVal('color.silkLight')};
  transition: all 0.16s ease 0s;
  opacity: 0;
  visibility: hidden;
  transform: translate3d(0, 0, 0);

  ${media.largeUp`
    position: static;
    opacity: 1;
    visibility: visible;
    background: transparent;
    width: auto;
    height: auto;
  `}

  ${({ revealed }) =>
    revealed &&
    css`
      opacity: 1;
      visibility: visible;
    `}
`;

const PageNavInner = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 18rem;
  height: 100%;
  background: ${themeVal('color.primary')};
  color: ${themeVal('color.baseLight')};
  transition: all 0.32s ease 0s;
  transform: translate(100%, 0);

  ${({ revealed }) =>
    revealed &&
    css`
      transform: translate(0, 0);
    `}

  ${media.largeUp`
    flex-flow: row nowrap;
    transform: none;
    width: auto;
    height: auto;
    background: transparent;
    color: inherit;
  `}
`;

const PageNavHeader = styled.header`
  display: flex;
  flex-flow: row nowrap;
  padding: ${glsp(0.5, 0.5, 0.5, 1)};
  align-items: center;

  ${media.largeUp`
    ${visuallyHidden()}
  `}
`;

const PageNavTitle = styled.h2`
  ${headingAlt}
  font-size: 0.875rem;
  line-height: 2rem;
  margin: 0 auto 0 0;

  ${media.largeUp`
    ${visuallyHidden()};
  `}
`;

const PageNavBody = styled.div`
  display: grid;
  grid-gap: ${glsp()};
  padding: ${glsp()};
  box-shadow: inset 0 1px 0 0 ${_rgba('#FFFFFF', 0.12)};
  overflow: auto;
  flex: 1;

  ${media.largeUp`
    padding: 0;
    box-shadow: none;
    overflow: visible;
  `}

  > *:last-child {
    padding-bottom: ${glsp()};

    ${media.largeUp`
      padding: 0;
    `}
  }
`;

const PrimeMenu = styled.ul`
  display: flex;
  flex-flow: column nowrap;

  ${media.largeUp`
    flex-flow: row nowrap;
  `}

  a {
    display: block;
    text-align: left;
  }

  > li {
    position: relative;

    ${media.largeUp`
      margin: 0 0 0 ${glsp(0.25)};
    `}
  }
`;

function PageHeader() {
  return (
    <PageHead role='banner'>
      <PageHeadInner>
        <PageHeadline>
          <PageTitle>
            <Link to='/' title='Go back to start'>
              {appTitle}
            </Link>
          </PageTitle>
          <PageSubtitle>
            by <a href='https://developmentseed.org/' title='Visit Development Seed'>Development Seed</a>
          </PageSubtitle>
        </PageHeadline>

        <PageNav role='navigation'>
          <PageNavInner>
            <PageNavHeader>
              <PageNavTitle>Menu</PageNavTitle>
            </PageNavHeader>
            <PageNavBody>
              <PrimeMenu>
                <li>
                  <Button
                    forwardedAs={NavLink}
                    exact
                    to='/'
                    variation='base-plain-light'
                    title='View home'
                  >
                    Start
                  </Button>
                </li>
                <li>
                  <Button
                    forwardedAs={NavLink}
                    exact
                    to='/about'
                    variation='base-plain-light'
                    title='Learn more'
                  >
                    About
                  </Button>
                </li>
              </PrimeMenu>
            </PageNavBody>
          </PageNavInner>
        </PageNav>
      </PageHeadInner>
    </PageHead>
  );
}

export default PageHeader;
