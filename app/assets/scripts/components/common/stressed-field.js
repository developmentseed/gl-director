import React from 'react';
import T from 'prop-types';

/**
 * Component to control the value of a given input.
 * The component accepts a validation function and validates the inserted value.
 * If the value is not valid, the field is marked with a error and then reverted
 * to its original value.
 *
 * @prop {string} value The input field value
 * @prop {function} onChange On change event handler
 * @prop {function} validate Validation function callback. Must return boolean
 * @prop {function} render Render function. Called with signature: (props) =>
 *  Where props:
 *    {boolean} errored Whether the field is in error state
 *    {string} value Value for the field
 *    {function} onChangeHandler Internal change handler to attach the field
 *    {function} onBlurHandler Internal blur handler to attach the field
 */
export default class StressedField extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      originalVal: props.value,
      value: props.value,
      errored: false
    };

    this.fieldRef = React.createRef();

    this.onValueChange = this.onValueChange.bind(this);
    this.onFieldBlur = this.onFieldBlur.bind(this);

    this.onKeypress = this.onKeypress.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.originalVal !== props.value) {
      return {
        value: props.value,
        originalVal: props.value
      };
    }
    return null;
  }

  componentDidMount() {
    if (this.fieldRef.current) {
      this.fieldRef.current.addEventListener('keypress', this.onKeypress);
    }
  }

  validateField() {
    const { value, originalVal } = this.state;
    const { onChange, validate } = this.props;

    if (!validate(value)) {
      this.setState({ errored: true });
      // We have to clear the error state after the animation so it can
      // error again.
      setTimeout(() => {
        this.setState({
          value: originalVal,
          errored: false
        });
      }, 550);
    } else {
      // all good.
      this.setState({ errored: false, originalVal: value });
      onChange(value);
    }
  }

  onKeypress(e) {
    const { value } = this.state;
    const { validate } = this.props;

    if (e.keyCode === 13) {
      // If the field is valid blur.
      if (validate(value)) {
        this.fieldRef.current.blur();
      } else {
        this.validateField();
      }
    }
  }

  onValueChange(e) {
    this.setState({ value: e.target.value });
  }

  onFieldBlur() {
    this.validateField();
  }

  render() {
    const { render } = this.props;
    const { errored, value } = this.state;

    return render({
      ref: this.fieldRef,
      errored,
      value,
      onChangeHandler: this.onValueChange,
      onBlurHandler: this.onFieldBlur
    });
  }
}

StressedField.propTypes = {
  value: T.oneOfType([T.string, T.number]),
  onChange: T.func,
  validate: T.func,
  render: T.func.isRequired
};
