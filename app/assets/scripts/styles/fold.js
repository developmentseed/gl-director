import styled from 'styled-components';

import Constrainer from './constrainer';

import { glsp } from './utils/theme-values';
import Heading from './type/heading';
import InpageHGroup from './inpage-hgroup';

export const Fold = styled.section`
  padding: ${glsp(3)} 0;

  ${Constrainer} {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: ${glsp(4)} ${glsp(2)};
  }
`;

export const FoldDetails = styled.div`
  ${InpageHGroup} {
    margin-bottom: ${glsp(2)};
  }
`;

export const FoldTitle = styled(Heading)`
  grid-column: span 5;
`;

export const GridSection = styled.section`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-column-gap: ${glsp(2)};
`;
