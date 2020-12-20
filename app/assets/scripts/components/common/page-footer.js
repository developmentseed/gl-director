import React from 'react';
import styled from 'styled-components';

import { themeVal } from '../../styles/utils/general';
import { glsp, _rgba } from '../../styles/utils/theme-values';
import media from '../../styles/utils/media-queries';
import { headingAlt } from '../../styles/type/heading';
import Button from '../../styles/button/button';

const PageFoot = styled.footer`
  position: relative;
  z-index: 18;
  background: ${themeVal('color.surface')};
  box-shadow: ${themeVal('boxShadow.elevationC')};
  min-height: 0;
  overflow: hidden;

  a,
  a:visited {
    color: inherit;
  }
`;

const PageFootInner = styled.div`
  display: flex;
  padding: ${glsp()};
  align-items: center;
  margin: 0 auto;
  height: 100%;
`;

const PageCredits = styled.address`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  font-style: normal;
  align-items: flex-start;

  ${media.smallUp`
    flex-flow: row nowrap;
  `}
`;

const Colophon = styled.p`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;

  time {
    ${headingAlt}
    font-size: 0.875rem;
    line-height: 1.5rem;
    margin-left: ${glsp(0.5)};
    padding-left: ${glsp(0.5)};
    box-shadow: inset 1px 0 0 0 ${themeVal('color.baseAlphaD')};
  }
`;

const CreditsLink = styled.a`
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;

  strong {
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: ${themeVal('type.base.bold')};
    letter-spacing: -0.0125em;
    display: block;
  }
`;

const InfoList = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  grid-gap: ${glsp(0, 1)};
  align-items: start;
  margin-bottom: ${glsp()};

  ${media.smallUp`
    grid-gap: ${glsp(0, 2)};
    margin: 0 0 0 auto;
    order: 2;
  `}

  ${media.mediumUp`
    grid-template-columns: repeat(2, auto);
    grid-auto-flow: auto;
    grid-gap: ${glsp(0, 0.5)};
    align-items: center;
  `}

  dt {
    ${headingAlt}
    font-size: 0.75rem;
    line-height: 1rem;
    grid-row: 1;

    ${media.mediumUp`
      margin-left: ${glsp()};
    `}
  }

  dd {
    grid-row: 2;

    ${media.mediumUp`
      grid-row: 1;
    `}

    > * {
      vertical-align: top;
      margin-left: -0.125rem;
    }
  }
`;

function PageFooter() {
  return (
    <PageFoot role='contentinfo'>
      <PageFootInner>
        <PageCredits>
          <InfoList>
            <dt>Open source code</dt>
            <dd>
              <Button
                forwardedAs='a'
                href='https://github.com/developmentseed/gl-director'
                title='Explore the code'
                variation='base-plain'
                size='small'
                useIcon='brand-github'
              >
                GitHub
              </Button>
            </dd>
          </InfoList>
          <Colophon>
            <CreditsLink
              href='https://developmentseed.org/'
              title='Visit Development Seed'
            >
              <strong>Development Seed</strong>
              <time dateTime='2020'>2020</time>
            </CreditsLink>
          </Colophon>
        </PageCredits>
      </PageFootInner>
    </PageFoot>
  );
}

PageFooter.propTypes = {};

export default PageFooter;
