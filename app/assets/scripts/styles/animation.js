import { keyframes } from 'styled-components';

export const shake = keyframes`
  8%, 41% {
    transform: translateX(-0.5rem);
  }

  25%, 58% {
    transform: translateX(0.5rem);
  }

  75% {
    transform: translateX(-0.25rem);
  }

  92% {
    transform: translateX(0.25rem);
  }

  0%, 100% {
    transform: translateX(0);
  }
`;

export const reveal = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;
