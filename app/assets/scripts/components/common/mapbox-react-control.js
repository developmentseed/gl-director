import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ThemeContext, ThemeProvider } from 'styled-components';

/**
 * Since it is rendered by Mapbox this component becomes detached from
 * react. To ensure that is becomes reconnected the render method should be
 * called with props and state on componentDidUpdate.
 * The constructor takes a render function with signature (props, state) => {}
 *
 * @example
 * function () {
 *   const control = useMapboxControl(() => (
 *     <SomeControl
 *        name={props.name}
 *        active={isActive}
 *     />
 *   ), [props.name, isActive]);
 *
 *  // Add the control to mapbox
 * }
 */

export function useMapboxControl(renderFn, props) {
  const containerRef = useRef();
  const themeContext = useContext(ThemeContext);

  const renderCmp = () => {
    render(
      <ThemeProvider theme={themeContext}>{renderFn()}</ThemeProvider>,
      containerRef.current
    );
  };

  useEffect(() => {
    if (!containerRef.current) return;
    renderCmp();
  }, props);

  return useMemo(
    () => ({
      onAdd() {
        containerRef.current = document.createElement('div');
        containerRef.current.className = 'mapboxgl-ctrl';
        renderCmp();
        return containerRef.current;
      },
      onRemove() {
        unmountComponentAtNode(containerRef.current);
        containerRef.current.parentNode.removeChild(containerRef.current);
        containerRef.current = null;
      }
    }),
    []
  );
}
