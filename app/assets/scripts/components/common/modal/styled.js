import styled, { createGlobalStyle } from 'styled-components';
import { themeVal } from '../../../styles/utils/general';
import { glsp, _rgba } from '../../../styles/utils/theme-values';

const sizeMapping = {
  small: '32rem',
  medium: '48rem',
  large: '64rem',
  xlarge: '80rem',
  full: '100%',
  fullscreen: '100%'
};

export const ModalContents = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: ${({ size }) =>
    size === 'fullscreen' ? `3rem auto` : `auto`};
  background: ${themeVal('color.surface')};
  border-radius: ${themeVal('shape.rounded')};
  width: 100%;
  margin: ${({ size }) => (size === 'fullscreen' ? 0 : `auto`)};
  box-shadow: 0 0 32px 2px ${_rgba(themeVal('type.base.color'), 0.04)},
    0 16px 48px -16px ${_rgba(themeVal('type.base.color'), 0.12)};

  /* Size attribute */
  ${({ size }) => `max-width: ${sizeMapping[size]};`}

  > *:last-child {
    margin-bottom: 0;
  }
`;

export const ModalWrapper = styled.section`
  display: flex;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9990;
  overflow-y: auto;
  opacity: 1;
  visibility: visible;
  background: ${themeVal('color.baseAlphaD')};
  transform: translate3d(0, 0, 0);
  padding: ${({ size }) => (size === 'fullscreen' ? 0 : glsp(2))};

  &.modal-appear,
  &.modal-enter {
    opacity: 0;
    visibility: hidden;
  }

  &.modal-enter-appear,
  &.modal-enter-active {
    transition: opacity 0.32s ease 0.1s, visibility 0.32s linear 0.1s;
    opacity: 1;
    visibility: visible;
  }

  &.modal-exit {
    opacity: 1;
    visibility: visible;
  }

  &.modal-exit-active {
    transition: opacity 0.32s ease 0.1s, visibility 0.32s linear 0.1s;
    opacity: 0;
    visibility: hidden;
  }
`;

export const BodyUnscrollable = createGlobalStyle`
  ${({ revealed }) =>
    revealed &&
    `
    body {
      overflow-y: hidden;
    }
  `}
`;

export const ModalHeader = styled.header`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background: #fff;
  padding: ${glsp(2)};
  border-radius: ${themeVal('shape.rounded')} ${themeVal('shape.rounded')} 0 0;

  & > *:last-child {
    margin-bottom: 0;
  }
`;

export const ModalHeadline = styled.div`
  display: flex;
  flex-flow: column nowrap;

  h1 {
    font-size: 1.25rem;
    line-height: 2rem;
    margin: 0;
  }
`;

export const ModalToolbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin-left: auto;
  align-items: center;
  align-self: flex-start;
  padding: ${glsp(1 / 8)} 0 ${glsp(1 / 8)} ${glsp()};
`;

export const ModalBody = styled.div`
  padding: 0 ${glsp(2)};

  &:first-child {
    padding-top: ${glsp(2)};
  }

  &:last-child {
    padding-bottom: ${glsp(2)};
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

export const ModalFooter = styled.footer`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background: #fff;
  padding: ${glsp(2)};
  border-radius: 0 0 ${themeVal('shape.rounded')} ${themeVal('shape.rounded')};

  > a,
  > button {
    margin-right: ${glsp()};
    min-width: 7rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
