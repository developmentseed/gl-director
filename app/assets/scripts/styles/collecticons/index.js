import { css } from 'styled-components';

const catalog = require('./catalog.json');

const fontEncode = 'data:application/font-woff2;charset=utf-8;base64,';
export const collecticonsFont = () => css`
  @font-face {
    font-family: '${catalog.name}';
    src: url(${fontEncode}${catalog.fonts.woff2}) format('woff2');
    font-weight: normal;
    font-style: normal;
  }
`;

/**
 * Includes a collecticons icon by name.
 * @param {string} name Icon name
 */
export default function collecticon(name) {
  name = `${catalog.className}-${name}`;
  const icon = catalog.icons.find((i) => i.icon === name);
  const content = icon ? `\\${icon.charCode}` : 'n/a';

  return css`
    speak: none;
    font-family: '${catalog.name}';
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;

    /* Better font rendering */
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: '${content}';
  `;
}
