import styled, { css } from 'styled-components';
import collecticon from '../../../styles/collecticons';
import { headingAlt } from '../../../styles/type/heading';
import { themeVal } from '../../../styles/utils/general';
import { glsp, _rgba, _tint } from '../../../styles/utils/theme-values';

const transitions = {
  up: {
    start: () => css`
      opacity: 0;
      transform: translate(0, ${glsp()});
    `,
    end: () => css`
      opacity: 1;
      transform: translate(0, ${glsp(-1)});
    `
  },
  down: {
    start: () => css`
      opacity: 0;
      transform: translate(0, ${glsp(-1)});
    `,
    end: () => css`
      opacity: 1;
      transform: translate(0, ${glsp()});
    `
  },
  left: {
    start: () => css`
      opacity: 0;
      transform: translate(${glsp()}, 0);
    `,
    end: () => css`
      opacity: 1;
      transform: translate(${glsp(-1)}, 0);
    `
  },
  right: {
    start: () => css`
      opacity: 0;
      transform: translate(${glsp(-1)}, 0);
    `,
    end: () => css`
      opacity: 1;
      transform: translate(${glsp()}, 0);
    `
  }
};

export const DropContent = styled.div`
  background: #fff;
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaC')},
    0 0 32px 2px ${themeVal('color.baseAlphaC')},
    0 16px 48px -16px ${_rgba(themeVal('color.base'), 0.16)};
  position: relative;
  z-index: 1000;
  width: 100vw;
  max-width: 14rem;
  padding: ${glsp()};
  text-align: left;
  color: ${themeVal('type.base.color')};
  font-size: 1rem;
  line-height: 1.5;
  transition: opacity 0.16s ease, transform 0.16s ease;

  .tether-target-attached-top.tether-element-attached-bottom & {
    ${transitions.up.end}

    &.drop-trans-exit {
      ${transitions.up.end}
    }

    &.drop-trans-exit-active {
      ${transitions.up.start}
    }
  }

  .tether-target-attached-bottom.tether-element-attached-top & {
    ${transitions.down.end}

    &.drop-trans-exit {
      ${transitions.down.end}
    }

    &.drop-trans-exit-active {
      ${transitions.down.start}
    }
  }

  .tether-target-attached-right.tether-element-attached-left & {
    ${transitions.right.end}

    &.drop-trans-exit {
      ${transitions.right.end}
    }

    &.drop-trans-exit-active {
      ${transitions.right.start}
    }
  }

  .tether-target-attached-left.tether-element-attached-right & {
    ${transitions.left.end}

    &.drop-trans-exit {
      ${transitions.left.end}
    }

    &.drop-trans-exit-active {
      ${transitions.left.start}
    }
  }

  &&.drop-trans-appear,
  &&.drop-trans-enter {
    ${({ direction }) => transitions[direction].start}
  }

  &&.drop-trans-enter-active,
  &&.drop-trans-appear-active {
    ${({ direction }) => transitions[direction].end}
  }

  &&.drop-trans-exit {
    ${({ direction }) => transitions[direction].end}
  }

  &&.drop-trans-exit-active {
    ${({ direction }) => transitions[direction].start}
  }
`;

// Drop content elements.
export const DropTitle = styled.h6`
  ${headingAlt()}
  color: ${_rgba(themeVal('color.base'), 0.64)};
  font-size: 0.875rem;
  line-height: 1rem;
  margin: ${glsp(0, 0, 1, 0)};
`;

export const DropMenu = styled.ul`
  list-style: none;
  margin: ${glsp(-1, -1, 1, -1)};
  box-shadow: 0 ${themeVal('layout.border')} 0 0 ${themeVal('color.baseAlphaC')};
  padding: ${glsp(1 / 2, 0)};
  min-width: 12rem;
  font-family: ${themeVal('type.base.family')};
  font-weight: ${themeVal('type.base.bold')};

  /* Styles when the ul items have icons */
  ${({ iconified }) =>
    iconified &&
    css`
      ${DropMenuItem} {
        padding-left: ${glsp(2.75)};

        &::before {
          position: absolute;
          z-index: 1;
          top: ${glsp(1 / 4)};
          left: ${glsp()};
          font-size: 1rem;
          line-height: 1.5rem;
          width: 1.5rem;
          text-align: center;
        }
      }
    `}

  /* Styles when the ul items are selectable */
  ${({ selectable }) =>
    selectable &&
    css`
      ${DropMenuItem} {
        padding-right: ${glsp(2.5)};
      }
    `}

  &:last-child {
    margin-bottom: ${glsp(-1)};
    box-shadow: none;
  }
`;

export const DropMenuItem = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${glsp(1 / 4, 1)};
  color: ${themeVal('type.base.color')};
  transition: all 0.16s ease 0s;

  &:visited {
    color: inherit;
  }

  &:hover,
  &:focus {
    color: ${themeVal('color.link')};
    background-color: ${_rgba(themeVal('color.link'), 0.12)};
    opacity: 1;
  }
  ${({ active }) =>
    active &&
    css`
      color: ${themeVal('color.primary')};

      &::after {
        ${collecticon('tick--small')}
        position: absolute;
        z-index: 1;
        top: ${glsp(1 / 4)};
        right: ${glsp(1 / 2)};
        font-size: 1rem;
        line-height: 1.5rem;
        width: 1.5rem;
        text-align: center;
      }
    `}

  ${({ useIcon }) =>
    useIcon &&
    css`
      &:before {
        ${collecticon(useIcon)}
      }
    `}
`;

export const DropInset = styled.div`
  background: ${_tint(0.96, themeVal('color.base'))};
  color: ${_tint(0.32, themeVal('type.base.color'))};
  box-shadow: inset 0 ${themeVal('layout.border')} 0 0
      ${themeVal('color.baseAlphaC')},
    inset 0 -${themeVal('layout.border')} 0 0 ${themeVal('color.baseAlphaC')};
  margin: ${glsp(-1, -1, 1, -1)};
  padding: ${glsp()};

  &:first-child {
    box-shadow: inset 0 -${themeVal('layout.border')} 0 0 ${themeVal('color.baseAlphaC')};
  }

  &:last-child {
    margin-bottom: ${glsp(-1)};
    box-shadow: inset 0 ${themeVal('layout.border')} 0 0
      ${themeVal('color.baseAlphaC')};
    border-radius: 0 0 ${themeVal('shape.rounded')} ${themeVal('shape.rounded')};
  }

  &:only-child {
    box-shadow: none;
  }

  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }
`;
