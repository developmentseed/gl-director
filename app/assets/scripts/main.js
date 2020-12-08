import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import theme from './styles/theme/theme';

import GlobalStyles from './styles/global';
import ErrorBoundary from './fatal-error-boundary';

// Views
import Home from './components/home';
import UhOh from './components/uhoh';
import About from './components/about';

import config from './config'

// Root component. Used by the router.
function Root() {
  /* eslint-disable-next-line no-unused-vars */
  const [innerHeight, setInnerHeight] = useState(null);

  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);

    // Store the height to set the page min height. This is needed for mobile
    // devices to account for the address bar, since 100vh does not work.
    // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    // Do not remove. Just uncomment if needed for the project.
    // window.addEventListener('resize', () => setInnerHeight(window.innerHeight));
  }, []);

  return (
    <BrowserRouter basename={config.basepath}>
      <ThemeProvider theme={theme.main}>
        <ErrorBoundary>
          <GlobalStyles innerHeight={innerHeight} />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/about' component={About} />
            <Route path='*' component={UhOh} />
          </Switch>
        </ErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  );
}

render(<Root />, document.querySelector('#app-container'));
