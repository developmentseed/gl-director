import React, { useCallback, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import styled, { css } from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';

import { glsp, _rgba } from '../../styles/utils/theme-values';
import { themeVal } from '../../styles/utils/general';

const ScrollWrapper = styled.div`
  position: relative;
`;

const renderShadowPosition = ({ position }) => {
  switch (position) {
    case 'top':
    case 'bottom':
      return css`
        ${position}: 0;
        left: 0;
        width: 100%;
        height: ${glsp(1.5)};
      `;
    case 'right':
    case 'left':
      return css`
        top: 0;
        ${position}: 0;
        width: ${glsp(1.5)};
        height: 100%;
      `;
  }
};

const renderShadowVariation = ({ position, variation }) => {
  switch (variation) {
    case 'light':
      return css`
        background: linear-gradient(
          to ${position},
          ${_rgba(themeVal('color.baseLight'), 0)} 0%,
          ${_rgba(themeVal('color.baseLight'), 1)} 100%
        );
      `;
    case 'dark':
      return css`
        background: linear-gradient(
          to ${position},
          ${_rgba(themeVal('color.baseDark'), 0)} 0%,
          ${_rgba(themeVal('color.baseDark'), 1)} 100%
        );
      `;
  }
};

const ScrollShadow = styled.div`
  position: absolute;
  pointer-events: none;
  z-index: 1000;

  ${renderShadowPosition}
  ${renderShadowVariation}
`;

// Ensure that it takes up the correct size.
const scrollbarSize = { width: '100%', height: '100%' };

/**
 * Shadow scrollbar component. Creates a box with custom scrollbars to ensure
 * consistency in all browsers.
 *
 * The <ShadowScrollbar /> supports styled-components and any styles applied to
 * it will be added to the wrapper div.
 *
 * Shadows are automatically added to the top, bottom, left, and right of the
 * component to indicate that there is content. The variation/existence of the
 * shadows can be controlled via props.
 *
 * @param {string} topShadowVariation The variation for the top shadow. Setting
 *   it to 'none' removes the shadow.
 * @param {string} bottomShadowVariation The variation for the bottom shadow.
 *   Setting it to 'none' removes the shadow.
 * @param {string} leftShadowVariation The variation for the left shadow.
 *   Setting it to 'none' removes the shadow.
 * @param {string} rightShadowVariation The variation for the right shadow.
 *   Setting it to 'none' removes the shadow.
 */
const ShadowScrollbar = React.forwardRef((props, ref) => {
  const {
    className,
    topShadowVariation,
    bottomShadowVariation,
    leftShadowVariation,
    rightShadowVariation,
    children,
    scrollbarsProps,
    ...rest
  } = props;

  const [shadowsOpacity, setShadowsOpacity] = useState({
    top: 1,
    bottom: 1,
    left: 1,
    right: 1
  });

  // If there are no shadows there's no point in doing calculations.
  const noShadow =
    topShadowVariation === 'none' &&
    bottomShadowVariation === 'none' &&
    leftShadowVariation === 'none' &&
    rightShadowVariation === 'none';

  const handleUpdate = useCallback(
    (values) => {
      if (noShadow) {
        return;
      }

      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollLeft,
        scrollWidth,
        clientWidth
      } = values;

      // Threshold in pixels for the shadows to start disappearing when reaching
      // the edges,
      const pxToGo = 20;
      const disappearRatio = 1 / pxToGo;

      const shadowTopOpacity = disappearRatio * Math.min(scrollTop, pxToGo);
      // Amount of scroll outside the container's height.
      const vOffAmount = scrollHeight - clientHeight;
      const shadowBottomOpacity =
        disappearRatio *
        (vOffAmount - Math.max(scrollTop, vOffAmount - pxToGo));

      const shadowLeftOpacity = disappearRatio * Math.min(scrollLeft, pxToGo);
      // Amount of scroll outside the container's width.
      const hOffAmount = scrollWidth - clientWidth;
      const shadowRightOpacity =
        disappearRatio *
        (hOffAmount - Math.max(scrollLeft, hOffAmount - pxToGo));

      setShadowsOpacity({
        top: shadowTopOpacity,
        bottom: shadowBottomOpacity,
        left: shadowLeftOpacity,
        right: shadowRightOpacity
      });
    },
    [noShadow]
  );

  return (
    <ScrollWrapper className={className} {...rest}>
      {topShadowVariation !== 'none' && (
        <ScrollShadow
          className='shadow-top'
          variation={topShadowVariation}
          position='top'
          style={{ opacity: shadowsOpacity.top }}
        />
      )}
      {leftShadowVariation !== 'none' && (
        <ScrollShadow
          className='shadow-left'
          variation={leftShadowVariation}
          position='left'
          style={{ opacity: shadowsOpacity.left }}
        />
      )}
      <Scrollbars
        ref={ref}
        autoHide
        style={scrollbarSize}
        onUpdate={handleUpdate}
        className='scroll-area'
        {...scrollbarsProps}
      >
        {children}
      </Scrollbars>
      {rightShadowVariation !== 'none' && (
        <ScrollShadow
          className='shadow-right'
          variation={rightShadowVariation}
          position='right'
          style={{ opacity: shadowsOpacity.right }}
        />
      )}
      {bottomShadowVariation !== 'none' && (
        <ScrollShadow
          className='shadow-bottom'
          variation={bottomShadowVariation}
          position='bottom'
          style={{ opacity: shadowsOpacity.bottom }}
        />
      )}
    </ScrollWrapper>
  );
});

ShadowScrollbar.propTypes = {
  className: T.string,
  topShadowVariation: T.string,
  bottomShadowVariation: T.string,
  leftShadowVariation: T.string,
  rightShadowVariation: T.string,
  scrollbarsProps: T.object,
  children: T.node
};

ShadowScrollbar.defaultProps = {
  topShadowVariation: 'light',
  bottomShadowVariation: 'light',
  leftShadowVariation: 'light',
  rightShadowVariation: 'light',
  scrollbarsProps: {}
};

export default ShadowScrollbar;
