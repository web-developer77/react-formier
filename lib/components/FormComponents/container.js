'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

var _components = require('../../components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Container',
  mixins: [_valueMixin2.default, _componentMixin2.default],
  getInitialValue: function getInitialValue() {
    return {};
  },
  setPristine: function setPristine(isPristine) {
    var _this = this;

    if (this.inputs) {
      Object.keys(this.inputs).forEach(function (key) {
        _this.inputs[key].setState({
          isPristine: isPristine
        });
      });
    }
  },
  elementChange: function elementChange(component) {
    var _this2 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var isValid = this.validateCustom();
    if (component.props.component.key) {
      this.setState(function (previousState) {
        // Clone to keep state immutable.
        var value = (0, _clone2.default)(previousState.value);
        var item = options.item || component;
        value[item.props.component.key] = item.state.value;
        previousState.value = value;
        previousState.isValid = isValid.isValid;
        // If a component isn't pristine, the container isn't pristine.
        if (!item.state.isPristine && previousState.isPristine) {
          previousState.isPristine = false;
        }
        return previousState;
      }, function () {
        return _this2.props.onChange(component, { container: _this2, item: _this2 });
      }, this);
    }
  },
  attachToForm: function attachToForm(component) {
    var _this3 = this;

    this.inputs = this.inputs || {};
    this.inputs[component.props.component.key] = component;
    this.setState(function (previousState) {
      return Object.assign(previousState, _this3.validate());
    }, function () {
      _this3.props.onChange(_this3);
    });
  },
  detachFromForm: function detachFromForm(component) {
    var _this4 = this;

    if (this.unmounting) {
      return;
    }
    var deleteKey = false;
    if (!component.props.component.hasOwnProperty('clearOnHide') || component.props.component.clearOnHide !== false) {
      deleteKey = component.props.component.key;
    }
    delete this.inputs[component.props.component.key];
    this.setState(function (previousState) {
      if (deleteKey) {
        delete previousState.value[deleteKey];
      }
      return Object.assign(previousState, _this4.validate());
    }, function () {
      _this4.props.onChange(_this4);
    });
  },
  validateCustom: function validateCustom() {
    var _this5 = this;

    var isValid = true;
    // If any inputs are false, the datagrid is false.
    if (this.inputs) {
      Object.keys(this.inputs).forEach(function (key) {
        if (_this5.inputs[key].state.isValid === false) {
          isValid = false;
        }
      });
    }
    return {
      isValid: isValid,
      errorType: '',
      errorMessage: ''
    };
  },
  getElements: function getElements() {
    var classLabel = 'control-label' + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? _react2.default.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    return _react2.default.createElement(
      'div',
      { className: 'formio-container' },
      _react2.default.createElement(_components.FormioComponentsList, _extends({}, this.props, {
        components: this.props.component.components,
        values: this.state.value,
        onChange: this.elementChange,
        attachToForm: this.attachToForm,
        detachFromForm: this.detachFromForm
      }))
    );
  }
});