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
              <p>Mapbox GL Director is an interface to easily generate terrain flyovers for your app using Mapbox GL JS. Development is ongoing and you can subscribe for updates.</p>
              <div id="mc_embed_signup">
                <form action="https://developmentseed.us7.list-manage.com/subscribe/post?u=f67c6427e57e45d86760a37c5&amp;id=1228c93614" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
                  <div id="mc_embed_signup_scroll">
                    <h2>Subscribe</h2>
                      <div class="indicates-required"><span class="asterisk">*</span> indicates required</div>
                      <div class="mc-field-group">
                        <label for="mce-EMAIL">Email Address  <span class="asterisk">*</span></label>
                        <input type="email" name="EMAIL" class="required email" id="mce-EMAIL" />
                      </div>
                  <div id="mce-responses" class="clear">
                    <div class="response" id="mce-error-response" style={{display:"none"}}></div>
                    <div class="response" id="mce-success-response" style={{display:"none"}}></div>
                  </div>
                  <div style={{position: "absolute", left: "-5000px"}} aria-hidden="true"><input type="text" name="b_f67c6427e57e45d86760a37c5_1228c93614" tabindex="-1" value="" /></div>
                  <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button" /></div>
                  </div>
              </form>
              </div>
            </Prose>
          </PageConstrainer>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default About;
