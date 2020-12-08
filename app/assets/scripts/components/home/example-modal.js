import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { Modal } from '../common/modal';

import mountainExample from './examples/mountain';
import sunsetExample from './examples/sunset';
import { glsp } from '../../styles/utils/theme-values';
import { themeVal } from '../../styles/utils/general';

const examples = [
  {
    id: 'mountain',
    name: 'Mountain fly by',
    shots: mountainExample,
    image: mountainExample[0].image
  },
  {
    id: 'sunset',
    name: 'Sunset',
    shots: sunsetExample,
    image: sunsetExample[1].image
  }
];

const CardsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: ${glsp(2)};

  li {
    grid-column: span 1;
  }
`;

const ExampleCardLink = styled.a`
  display: flex;
  height: 100%;

  &:hover {
    opacity: 1;
  }
`;

const ExampleCard = styled.article`
  flex: 1;
  position: relative;
  border-radius: ${themeVal('shape.rounded')};
  overflow: hidden;
  background: ${themeVal('color.baseAlphaD')};

  img {
    display: block;
    width: 100%;
    transition: all 0.32s ease 0s;

    &:hover {
      transform: scale(1.125);
    }
  }

  h1 {
    position: absolute;
    bottom: ${glsp(0.5)};
    left: ${glsp(0.5)};
    margin: 0;
    color: #fff;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: ${themeVal('type.base.bold')};
  }
`;

function ExamplesModal(props) {
  const { onCloseClick, onExampleSelect, revealed } = props;

  return (
    <Modal
      id='modal'
      size='medium'
      revealed={revealed}
      onCloseClick={onCloseClick}
      title='Examples'
      content={
        <CardsList>
          {examples.map((ex) => (
            <li key={ex.id}>
              <ExampleCardLink
                href='#'
                title='View this example'
                onClick={(e) => {
                  e.preventDefault();
                  onExampleSelect(ex);
                }}
              >
                <ExampleCard>
                  <img src={ex.image} alt='Example image' width={320} />
                  <h1>{ex.name}</h1>
                </ExampleCard>
              </ExampleCardLink>
            </li>
          ))}
          <li>
            <ExampleCardLink
              href='#'
              title='Craft a custom experience'
              onClick={(e) => {
                e.preventDefault();
                onExampleSelect(null);
              }}
            >
              <ExampleCard>
                <h1>Custom</h1>
              </ExampleCard>
            </ExampleCardLink>
          </li>
        </CardsList>
      }
    />
  );
}

ExamplesModal.propTypes = {
  onCloseClick: T.func,
  onExampleSelect: T.func,
  revealed: T.bool
};

export default ExamplesModal;
