'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTextMask = require('react-text-mask');

var _reactTextMask2 = _interopRequireDefault(_reactTextMask);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  timeout: null,
  customState: function customState(state) {
    state.hasChanges = false;
    return state;
  },
  triggerChange: function triggerChange() {
    var _this = this;

    if (typeof this.props.onChange === 'function' && this.state.hasChanges) {
      this.props.onChange(this);
      this.setState(function (state) {
        state.hasChanges = false;
        return false;
      }, function () {
        return _this.props.onChange(_this);
      });
    }
  },
  onChangeInput: function onChangeInput(event) {
    var _this2 = this;

    var value = event.target.value;
    // Allow components to respond to onChange event.
    if (typeof this.onChangeCustom === 'function') {
      value = this.onChangeCustom(value);
    }
    var index = this.props.component.multiple ? event.target.getAttribute('data-index') : null;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(function () {
      _this2.triggerChange();
    }, 500);
    this.setState(function (previousState) {
      if (index !== null && Array.isArray(previousState.value)) {
        // Clone so we keep state immutable.
        var newValue = (0, _lodash.clone)(previousState.value);
        newValue[index] = value;
        previousState.value = newValue;
      } else {
        previousState.value = value;
      }
      previousState.isPristine = false;
      previousState.hasChanges = true;
      Object.assign(previousState, _this2.validate(previousState.value));
      return previousState;
    });
  },
  onBlur: function onBlur(event) {
    this.triggerChange();
  },
  /**
   * Returns an input mask that is compatible with the input mask library.
   * @param {string} mask - The Form.io input mask.
   * @returns {Array} - The input mask for the mask library.
   */
  getInputMask: function getInputMask(mask) {
    if (typeof this.customMask === 'function') {
      return this.customMask();
    }
    if (!mask) {
      return false;
    }
    if (mask instanceof Array) {
      return mask;
    }
    var maskArray = [];
    for (var i = 0; i < mask.length; i++) {
      switch (mask[i]) {
        case '9':
          maskArray.push(/\d/);
          break;
        case 'a':
        case 'A':
          maskArray.push(/[a-zA-Z]/);
          break;
        case '*':
          maskArray.push(/[a-zA-Z0-9]/);
          break;
        default:
          maskArray.push(mask[i]);
          break;
      }
    }
    return maskArray;
  },
  getSingleElement: function getSingleElement(value, index) {
    var _this3 = this;

    index = index || 0;
    var _props = this.props,
        component = _props.component,
        name = _props.name,
        readOnly = _props.readOnly;

    var mask = component.inputMask || '';
    var properties = {
      type: component.inputType !== 'number' ? component.inputType : 'text',
      key: index,
      className: 'form-control',
      id: component.key,
      'data-index': index,
      name: name,
      value: value,
      disabled: readOnly,
      placeholder: component.placeholder,
      onChange: this.onChangeInput,
      onBlur: this.onBlur,
      ref: function ref(input) {
        return _this3.element = input;
      }
    };

    if (mask || component.type === 'currency' || component.type === 'number') {
      properties.inputMode = 'number';
      properties.mask = this.getInputMask(mask);
      properties.placeholderChar = "_";
      properties.guide = true;
      return _react2.default.createElement(_reactTextMask2.default, properties);
    } else {
      return _react2.default.createElement('input', properties);
    }
  }
};