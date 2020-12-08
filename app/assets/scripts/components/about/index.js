import React from 'react';
import styled from 'styled-components';

import App from '../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../styles/inpage';
import Constrainer from '../../styles/constrainer';
import Prose from '../../styles/type/prose';

import { glsp } from '../../styles/utils/theme-values';

const PageConstrainer = styled(Constrainer)`
  ${Prose} {
    max-width: 50rem;
  }

  > *:not(:last-child) {
    margin-bottom: ${glsp(2)};
  }
`;

function About() {
  return (
    <App pageTitle='About'>
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>About</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <PageConstrainer>
            <Prose>
              <p>About this demo</p>
            </Prose>
          </PageConstrainer>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default About;
