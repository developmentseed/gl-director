import styled from 'styled-components';
import { themeVal } from './utils/general';

import { glsp } from './utils/theme-values';
import media from './utils/media-queries';

const Constrainer = styled.div`
  padding: ${glsp(2, 1)};
  margin: 0 auto;
  max-width: ${themeVal('layout.max')};

  ${media.mediumUp`
    padding: ${glsp(2)};
  `}

  ${media.largeUp`
    padding: ${glsp(4, 2)};
  `}
`;

export default Constrainer;
