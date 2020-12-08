import styledComponents, { css } from 'styled-components';

/**
 * Disclaimer:
 * This code is highly dependent on how styled-components worked at the moment
 * this was written. It is likely that any update to the styled-components
 * constructor function will break this.
 *
 * Adapted from https://github.com/styled-components/styled-components/blob/4aa2fdbb3bb890807a5ef361e708870e8d718ec6/packages/styled-components/src/constructors/constructWithOptions.js
 *
 *
 *    ********************* USE AT YOUR OWN RISK **************************
 *
 *
 * Enhanced version of styled-components' styled method.
 * This is used to get the styles of the component, by adding a `getStyles`
 * method to the component. This method accepts props that will be merged with
 * already set properties before merging.
 *
 * Use is the same as styled-components:
 *     const Btn = styled.button`
 *       color: red
 *     `
 * or
 *     const Btn = styled(MyBtnComponent)`
 *       color: red
 *     `
 *
 * Motivation:
 * When using a third party library that doesn't support styled-components it
 * would be good to be able to apply already created styles using css classes.
 * This is currently not possible with styled-components and leads to a lot of
 * style duplications.
 * Issue: https://github.com/styled-components/styled-components/issues/1209
 *
 * Use case from the issue, solved with this code:
 * Imagine we have a button configurable through props:
 * ```css
 *   const buttonStyles = css`
 *     background: ${props => props.primary ? "teal" : "white"};
 *     color: ${props => props.primary ? "white" : "teal"};
 *     font-size: 1rem;
 *   `;
 *   const Button = styled.button`
 *     ${buttonStyles}
 *   `;
 * ```
 * and the same styled need to be applied to a button of a third party plugin.
 * We'd need to use the `createGlobalStyle` to set the styles for the button's
 * class, but we'd also need a way to pass the attributes.
 * ```css
 *   .third-party-button {
 *     ${Button.getStyles({ primary: true }}
 *   }
 * ```
 *
 * @param {mixed} element The react element.
 */
function styled(element) {
  // Create a function that receives a component constructor. This is needed
  // because styled-components creates components with several functions, like
  // the root, attrs() and withConfig().
  const templateFn = (component) =>
    // Return a function that handles the template literal using the component
    // creator function.
    (...templateLiteral) => {
      // Create the styled component with the given element and pass the
      // arguments along.
      const fancyStyled = component(...templateLiteral);
      // To the styled component that was returned add a getStyles method which
      // accepts props to allow customization.
      fancyStyled.getStyles = (newProps) => {
        // This this is supposed to be used as part of interpolation return
        // a function that accepts props
        //
        // Example:
        // css`
        //  ${Button.getStyles({ primary: true})}
        // `;
        //
        // same as:
        //
        // css`
        //  ${props => Button.getStyles({ primary: true})(props)}
        // `;
        return (props) => {
          // Recursive function to render all the nested css declarations.
          // This happens when we have several uses of `css` within the style
          // definition. Absurd example:
          // css`
          //   ${({ active }) => active && css`
          //     color: red;
          //     ${({ primary }) => primary ? css`
          //         background: ${primary.bg};
          //       ` : css`
          //         background: white;
          //       `
          //     }
          //   `}
          // `;
          const render = (style) => {
            // If we're dealing with a style array, every entry needs to be
            // checked and maybe rendered.
            return Array.isArray(style)
              ? style.map((styleLine) => {
                  // A styled array may consist of strings, numbers and functions.
                  // Functions need to be rendered recursively because they may
                  // result in other functions.
                  return typeof styleLine === 'function'
                    ? // Execute the function passing the merged props.
                      render(styleLine({ ...props, ...newProps }))
                    : // No recursive render needed.
                      styleLine;
                })
              : // If the current style line is not an array, there's no more
                // rendering to do.
                style;
          };
          // Start the render process by flattening the template literal using
          // styled-components' css function.
          return render(css(...templateLiteral));
        };
      };
      return fancyStyled;
    };

  // Create a styled-component which will be used by the template function.
  const component = styledComponents(element);

  // The styled() must return a function that when called directly returns the
  // styled component. This is the case when styled is called with a
  // component directly:
  // const Btn = styled(BaseBtn)
  const theConstructor = templateFn(component);
  // However it also has some methods to modify the component that have to be
  // considered. The withConfig is mostly called by the styled-processor on
  // transpile time to add metadata.
  theConstructor.withConfig = (config) =>
    templateFn(component.withConfig(config));
  // Lastly the attrs method allows user to add default props to the components:
  // const Btn = styled(Button).attrs({ size: 'large' })`
  //   background: teal;
  // `
  theConstructor.attrs = (attrs) => templateFn(component.attrs(attrs));

  return theConstructor;
}

// To ensure that the styled api stays consistent add the styled.element
// capabilities to the function.
// This will enable the use of styled.div, styled.a, etc...
Object.keys(styledComponents).forEach((k) => {
  styled[k] = styled(k);
});

export default styled;
