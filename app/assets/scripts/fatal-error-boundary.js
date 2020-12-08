import React from 'react';
import styled from 'styled-components';

const FatalError = styled.div`
  text-align: center;

  span {
    font-style: italic;
  }
`;

export default class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { error: error };
  }

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  render() {
    return this.state.error ? (
      <FatalError>
        <h1>Oh Snap :&apos;( Something went wrong</h1>
        <p>This on us, and we&apos;ll fix it as soon as possible</p>
        <p>
          Error: <span>{this.state.error.message}</span>
        </p>
      </FatalError>
    ) : (
      // eslint-disable-next-line react/prop-types
      this.props.children
    );
  }
}
