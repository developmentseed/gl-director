import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import {
  BodyUnscrollable,
  ModalContents,
  ModalHeader,
  ModalHeadline,
  ModalToolbar,
  ModalBody,
  ModalFooter,
  ModalWrapper
} from './styled';
import Button from '../../../styles/button/button';

/**
 * Returns the result of the render function is one is provided. Otherwise
 * return the fallback component.
 *
 * @example
 * tryRenderFunction(renderBody, {}, (
 *  <p>The default body</p>
 * ))
 *
 * @param {function} fn Render function
 * @param {object} bag Object to pass to the render function
 * @param {Component} fallback Fallback component if no function is provided.
 */
const tryRenderFunction = (fn, bag = {}, fallback = null) =>
  typeof fn === 'function' ? fn(bag) : fallback;

/**
 * React modal component.
 * Displays a modal component which is portaled to the body to ensure is appears
 * over all other elements
 *
 * @param {string} id An id for the modal
 * @param {bool} revealed Whether or not the modal is visible.
 * @param {string} size Size of the modal. One of "small", "medium", "large", "xlarge", "full"
 * @param {string} className Classes for the modal wrapper
 * @param {function} onOverlayClick Callback function for overlay click
 * @param {function} onCloseClick Callback function for close button click
 * @param {bool} closeButton Whether or not the modal should render
 *               the default close button. Default `true`.
 * @param {string} title Title for the modal. Required unless the header is
 *                 being overridden.
 * @param {node} content Modal body content, rendered inside `ModalBody`.
 *               Required unless the body is being overridden.
 * @param {node} footerContent Modal footer content, rendered
 *               inside `ModalFooter`.
 * @param {function} renderContents Overrides the contents of the modal.
 *                   Anything returned by this function is rendered inside
 *                   `ModalContents`.
 *                   Signature: fn(bag). Bag has the following props:
 *                     {function} close Method to close the modal.
 * @param {function} renderHeader Overrides the modal header element.
 *                   Anything returned by this function is rendered instead of
 *                   `ModalHeader`.
 *                   Signature: fn(bag). Bag has the following props:
 *                     {function} close Method to close the modal.
 * @param {function} renderHeadline Overrides the modal headline element.
 *                   Anything returned by this function is rendered instead of
 *                   `ModalHeadline`.
 *                   Signature: fn(bag). Bag has the following props:
 *                     {function} close Method to close the modal.
 * @param {function} renderToolbar Overrides the modal toolbar element.
 *                   Anything returned by this function is rendered instead of
 *                   `ModalToolbar`.
 *                   Signature: fn(bag). Bag has the following props:
 *                     {function} close Method to close the modal.
 * @param {function} renderBody Overrides the modal body element.
 *                   Anything returned by this function is rendered instead of
 *                   `ModalBody`.
 *                   Signature: fn(bag). Bag has the following props:
 *                     {function} close Method to close the modal.
 * @param {function} renderFooter Overrides the modal footer element.
 *                   Anything returned by this function is rendered instead of
 *                   `ModalFooter`.
 *                   Signature: fn(bag). Bag has the following props:
 *                     {function} close Method to close the modal.
 */
function Modal(props) {
  const {
    id,
    title,
    content,
    footerContent,
    closeButton,
    size,
    revealed,
    className,
    onCloseClick,
    onOverlayClick,
    renderContents,
    renderHeader,
    renderHeadline,
    renderToolbar,
    renderBody,
    renderFooter
  } = props;

  const uuid = useRef(Modal.generateUUID());
  const [hasMounted, setHasMounted] = useState(false);
  const [modalElement, setModalElement] = useState(null);

  // Key listener for esc key.
  useEffect(() => {
    const keyListener = (e) => {
      // ESC.
      if (revealed && e.keyCode === 27) {
        e.preventDefault();
        onCloseClick(e);
      }
    };
    document.addEventListener('keyup', keyListener);

    return () => {
      document.removeEventListener('keyup', keyListener);
    };
  }, [revealed]);

  // Will be called on initial mount.
  useEffect(() => {
    const el = document.createElement('div');
    el.className = `modal-portal-${uuid.current}`;
    document.body.appendChild(el);

    setModalElement(el);
    setHasMounted(true);

    return () => {
      document.body.removeChild(el);
    };
  }, []);

  // Note:
  // This check is necessary for this component to work when used with SSR.
  // While react-portal will itself check if window is available, that is not
  // enough to ensure that there aren't discrepancies between what the server
  // renders and what the client renders, as the client *will* have access to
  // the window. Therefore, we should only render the root level portal element
  // once the component has actually mounted, as determined by a state variable.
  if (!hasMounted) {
    return null;
  }

  const _onOverlayClick = (e) => {
    // Prevent children from triggering this.
    if (e.target === e.currentTarget && typeof onOverlayClick === 'function') {
      onOverlayClick(e);
    }
  };

  const klasses = ['modal', className];

  const _onCloseClick = (e) => {
    e.preventDefault();
    onCloseClick(e);
  };

  const fnBag = {
    close: _onCloseClick
  };

  return createPortal(
    <CSSTransition
      in={revealed}
      appear
      unmountOnExit
      classNames='modal'
      timeout={{ enter: 400, exit: 400 }}
    >
      <ModalWrapper
        className={klasses.join(' ')}
        key={`modal-${id}`}
        onClick={_onOverlayClick}
        id={id}
        size={size}
      >
        <BodyUnscrollable revealed={revealed} />
        <ModalContents className='modal__contents' size={size}>
          {/* Contents */}
          {tryRenderFunction(
            renderContents,
            fnBag,
            <React.Fragment>
              {/* Header */}
              {tryRenderFunction(
                renderHeader,
                fnBag,
                <ModalHeader>
                  {/* Headline */}
                  {tryRenderFunction(
                    renderHeadline,
                    fnBag,
                    <ModalHeadline>
                      <h1>{title}</h1>
                    </ModalHeadline>
                  )}
                  {/* END Headline */}
                  {/* Toolbar */}
                  {tryRenderFunction(
                    renderToolbar,
                    fnBag,
                    closeButton && (
                      <ModalToolbar>
                        <Button
                          useIcon='xmark--small'
                          size='small'
                          hideText
                          onClick={_onCloseClick}
                        >
                          Close
                        </Button>
                      </ModalToolbar>
                    )
                  )}
                  {/* END Toolbar */}
                </ModalHeader>
              )}
              {/* END Header */}
              {/* Body */}
              {tryRenderFunction(
                renderBody,
                fnBag,
                <ModalBody>{content}</ModalBody>
              )}
              {/* END Body */}
              {/* Footer */}
              {tryRenderFunction(
                renderFooter,
                fnBag,
                footerContent ? (
                  <ModalFooter>{footerContent}</ModalFooter>
                ) : null
              )}
              {/* END Footer */}
            </React.Fragment>
          )}
          {/* END Contents */}
        </ModalContents>
      </ModalWrapper>
    </CSSTransition>,
    modalElement
  );
}

// Use a static method to generate a uuid so it can be mocked during tests.
Modal.generateUUID = () => Math.random().toString(36).substr(2, 5);

Modal.defaultProps = {
  closeButton: true,
  revealed: false,
  size: 'medium',

  onOverlayClick: () => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Modal', 'onOverlayClick handler not implemented');
    }
  },

  onCloseClick: () => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Modal', 'onCloseClick handler not implemented');
    }
  }
};

Modal.propTypes = {
  id: T.string.isRequired,
  revealed: T.bool,
  className: T.string,
  size: T.string,
  onOverlayClick: T.func,
  onCloseClick: T.func,
  closeButton: T.bool,
  title: T.string,

  renderContents: T.func,
  renderHeader: T.func,
  renderHeadline: T.func,
  renderToolbar: T.func,
  renderBody: T.func,
  content: T.node,
  renderFooter: T.func,
  footerContent: T.node
};

export {
  Modal,
  ModalHeader,
  ModalHeadline,
  ModalToolbar,
  ModalBody,
  ModalFooter
};
