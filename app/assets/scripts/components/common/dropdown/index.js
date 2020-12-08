import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import T from 'prop-types';
import TetherComponent from 'react-tether';
import { CSSTransition } from 'react-transition-group';

import {
  DropContent,
  DropTitle,
  DropMenu,
  DropMenuItem,
  DropInset
} from './styled';

/**
 * Calculates the values for tether based on the desired alignment and direction.
 *
 * @throws Error if values are not compatible with one another.
 *
 * @param {string} direction Direction of the drop.
 * @param {string} alignment Alignment of the drop.
 */
const getTetherAttachments = (direction, alignment) => {
  let allowed;

  if (direction === 'up' || direction === 'down') {
    allowed = ['left', 'center', 'right'];
  } else if (direction === 'left' || direction === 'right') {
    allowed = ['top', 'middle', 'bottom'];
  } else {
    throw new Error(
      `Dropdown: direction "${direction}" is not supported. Use one of: up, down, left, right`
    );
  }

  if (allowed.indexOf(alignment) === -1) {
    throw new Error(
      `Dropdown: alignment "${alignment}" is not supported when direction is ${direction}. Use one of: ${allowed.join(
        ', '
      )}`
    );
  }

  // The attachments are returned as an array:
  // [tetherAttachment, tetherTargetAttachment]
  switch (direction) {
    case 'up':
      return [`bottom ${alignment}`, `top ${alignment}`];
    case 'down':
      return [`top ${alignment}`, `bottom ${alignment}`];
    case 'right':
      return [`${alignment} left`, `${alignment} right`];
    case 'left':
      return [`${alignment} right`, `${alignment} left`];
  }
};

// Global variable to hold a reference to each dropdown. Needed for the close
// all function.
let activeDropdowns = [];

/**
 * Returns the closes instance up the DOM tree that matches the provided
 * conditions.
 * @param {HTMLElement} el The element from which to start
 * @param {function} cb Callback to validate the element. Returning true will
 *                      indicate the element was found.
 */
const getClosest = (el, cb) => {
  do {
    // If the click is released outside the view port, the el will be
    // HTMLDocument and won't have hasAttribute method.
    if (el && el.hasAttribute && cb(el)) {
      return el;
    }
    el = el.parentNode; // eslint-disable-line
  } while (el && el.tagName !== 'BODY' && el.tagName !== 'HTML');

  return null;
};

/**
 * Returns the closes element with the [data-drop-instance] attribute.
 * @param {HTMLElement} el The element from which to start
 */
const getClosestInstance = (el) =>
  getClosest(el, (element) => element.hasAttribute('data-drop-instance'));

/**
 * Returns the closes element inside the dropdown that is capable of closing it
 * by having the [data-dropdown="click.close"] attribute.
 * @param {HTMLElement} el The element from which to start
 */
const getClosestDropCloser = (el) =>
  getClosest(el, (element) => {
    const v = element.getAttribute('data-dropdown');
    return v === 'click.close';
  });

const useBodyListenerEffect = (uuid, setOpen) => {
  useEffect(() => {
    // Abort in case of SSR.
    if (typeof window === 'undefined') return;

    const listener = (e) => {
      const target = e.target;

      // Closer as in an element that can close the dropdown.
      const closerElement = getClosestDropCloser(target);

      if (
        target.tagName === 'BODY' ||
        target.tagName === 'HTML' ||
        closerElement
      ) {
        // If we are at the top of the DOM tree or clicked an element capable of
        // closing the dropdown.
        return setOpen(false);
      }

      // The closest instance is the closest parent element with a
      // [data-drop-instance] attribute. This attribute will have the uuid of the
      // dropdown. This element will also have a [data-drop-el] attribute which
      // will have a value of either "trigger" or "content" depending on which it
      // refers to.
      const closestInstance = getClosestInstance(target);
      if (!closestInstance) return setOpen(false);

      const closestUuid = closestInstance.getAttribute('data-drop-instance');

      if (
        closestInstance.getAttribute('data-drop-el') === 'trigger' &&
        closestUuid === uuid
      ) {
        // If we're dealing with the trigger for this instance don't do anything.
        // There are other listeners in place.
        return;
      }

      if (
        closestInstance.getAttribute('data-drop-el') === 'content' &&
        closestUuid === uuid
      ) {
        // If we're dealing with the content for this instance don't do anything.
        // The content elements can use data-dropdown='click.close' if they need to
        // close the dropdown, otherwise a trigger click is needed.
        return;
      }
      // In all other cases close the dropdown.
      setOpen(false);
    };

    activeDropdowns.push({ uuid, setOpen });
    window.addEventListener('click', listener, true);

    return () => {
      activeDropdowns = activeDropdowns.filter((d) => d.uuid !== uuid);
      window.removeEventListener('click', listener, true);
    };
  }, [uuid]);
};

const Dropdown = React.forwardRef((props, ref) => {
  const {
    direction,
    alignment,
    id,
    className,
    onChange,
    triggerElement,
    children
  } = props;

  const uuid = useRef(Dropdown.generateUUID());
  const tetherRef = useRef(null);
  const [isOpen, setOpen] = useState(false);

  useBodyListenerEffect(uuid.current, setOpen);

  useImperativeHandle(ref, () => ({
    reposition: () => tetherRef.current.position(),
    open: () => setOpen(true),
    close: () => setOpen(false)
  }));

  const [tetherAttachment, tetherTargetAttachment] = getTetherAttachments(
    direction,
    alignment
  );

  const toggleDropdown = (e) => {
    e && e.preventDefault();
    setOpen(!isOpen);
  };

  // Base and additional classes for the trigger and the content.
  const klasses = [
    className,
    'drop__content',
    'drop-trans',
    `drop-trans--${direction}`
  ]
    .filter(Boolean)
    .join(' ');

  /* eslint-disable-next-line prefer-const */
  let dropdownContentProps = {
    id: id || undefined,
    className: klasses,
    'data-drop-instance': uuid.current,
    'data-drop-el': 'content',
    direction,
    onChange,
    children
  };

  return (
    <TetherComponent
      ref={tetherRef}
      // attachment is the content.
      attachment={tetherAttachment}
      // targetAttachment is the trigger
      targetAttachment={tetherTargetAttachment}
      constraints={[
        {
          to: 'window',
          attachment: 'both',
          pin: true
        }
      ]}
      renderTarget={(ref) => {
        return triggerElement({
          ref, // Ref from thether. Must be attached.
          onClick: toggleDropdown,
          active: isOpen,
          className: isOpen ? 'active' : '',
          'data-drop-el': 'trigger',
          'data-drop-instance': uuid.current
        });
      }}
      renderElement={(ref) => {
        return (
          <CSSTransition
            ref={ref}
            in={isOpen}
            unmountOnExit
            appear
            classNames='drop-trans'
            timeout={{
              appear: 300,
              enter: 300,
              exit: 300
            }}
          >
            <TransitionItem {...dropdownContentProps} />
          </CSSTransition>
        );
      }}
    />
  );
});

Dropdown.displayName = 'Dropdown';

// Use a static method to generate a uuid so it can be mocked during tests.
Dropdown.generateUUID = () => Math.random().toString(36).substr(2, 5);

Dropdown.closeAll = () => activeDropdowns.forEach((d) => d.setOpen(false));

Dropdown.defaultProps = {
  /* eslint-disable-next-line react/display-name */
  triggerElement: (props) => (
    <button type='button' {...props}>
      Dropdown
    </button>
  ),
  direction: 'down',
  alignment: 'center'
};

Dropdown.propTypes = {
  id: T.string,
  onChange: T.func,

  triggerElement: T.func,

  direction: T.oneOf(['up', 'down', 'left', 'right']),
  alignment: T.oneOf(['left', 'center', 'right', 'top', 'middle', 'bottom']),

  className: T.string,
  children: T.node
};

// The TransitionItem is only used to trigger the change event on mount/unmount.
function TransitionItem(props) {
  const { onChange, ...rest } = props;

  useEffect(() => {
    onChange && onChange(true);
    return () => {
      onChange && onChange(false);
    };
  }, []);

  return <DropContent {...rest} />;
}

TransitionItem.propTypes = {
  onChange: T.func,
  props: T.shape({
    direction: T.string,
    className: T.string
  }),
  children: T.node
};

export default Dropdown;

export { DropTitle, DropMenu, DropMenuItem, DropInset };
