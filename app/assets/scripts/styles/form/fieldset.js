import styled from 'styled-components';

import { themeVal } from '../utils/general';
import { glsp } from '../utils/theme-values';

export const FormFieldset = styled.fieldset`
  background-color: ${themeVal('color.baseAlphaA')};
  border-radius: ${themeVal('shape.rounded')};
  border: ${themeVal('layout.border')} solid ${themeVal('color.baseAlphaC')};
  margin-left: -${glsp(2)};
  margin-right: -${glsp(2)};
  padding: 0;

  fieldset & {
    margin-left: -${glsp()};
    margin-right: -${glsp()};
  }
`;

export const FormFieldsetHeader = styled.div`
  display: flex;
  flex-flow: wrap nowrap;
  justify-content: space-between;
  padding: ${glsp(0.75, 2)};
  border-bottom: ${themeVal('layout.border')} solid
    ${themeVal('color.baseAlphaC')};

  fieldset fieldset & {
    padding: ${glsp(0.25, 1)};
  }
`;

export const FormFieldsetBody = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-gap: ${glsp()};
  padding: ${glsp(2)};

  fieldset fieldset & {
    padding: ${glsp()};
  }
`;
