import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

function UhOh() {
  return (
    <App pageTitle='Page not found'>
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Page not found</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <PageConstrainer>
            <Prose>
              <p>
                We were not able to find the page you are looking for. It may
                have been archived or removed.
              </p>
              <p>
                You might find an older snapshot of this page at the{' '}
                <a
                  href='http://archive.org/web/'
                  title='Find on Internet Archive'
                >
                  Internet Archive
                </a>
                .
              </p>
              <p>
                <Link to='/' title='Visit the homepage'>
                  Visit the homepage
                </Link>
              </p>
            </Prose>
          </PageConstrainer>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default UhOh;
