'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DropdownList = require('react-widgets/lib/DropdownList');

var _DropdownList2 = _interopRequireDefault(_DropdownList);

var _Multiselect = require('react-widgets/lib/Multiselect');

var _Multiselect2 = _interopRequireDefault(_Multiselect);

var _List2 = require('react-widgets/lib/List');

var _List3 = _interopRequireDefault(_List2);

var _util = require('../../../util');

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = {
  data: {},
  getInitialState: function getInitialState() {
    this.data = _extends({}, this.props.data);
    return {
      selectItems: [],
      searchTerm: '',
      hasNextPage: false,
      open: false
    };
  },
  willReceiveProps: function willReceiveProps(nextProps) {
    if (this.props.component.refreshOn && !nextProps.formPristine) {
      var refreshOn = this.props.component.refreshOn;
      this.refresh = false;
      if (refreshOn === 'data') {
        if (!(0, _isEqual2.default)(this.data, nextProps.data)) {
          this.refresh = true;
        }
      } else {
        if (!this.data.hasOwnProperty(refreshOn) && nextProps.hasOwnProperty(refreshOn) || this.data[refreshOn] !== nextProps.data[refreshOn]) {
          this.refresh = true;
        } else if (nextProps && nextProps.row && nextProps.row.hasOwnProperty(refreshOn) && this.props.row[refreshOn] !== nextProps.row[refreshOn]) {
          this.refresh = true;
        }
      }
      if (this.refresh && this.props.component.clearOnRefresh) {
        this.setValue(this.getDefaultValue());
      }
    }
    if (this.refresh) {
      this.refreshItems();
      this.refresh = false;
    }
    this.data = _extends({}, nextProps.data);
  },
  valueField: function valueField() {
    var valueField = this.props.component.valueProperty || 'value';
    if (typeof this.getValueField === 'function') {
      valueField = this.getValueField();
    }
    return valueField;
  },
  textField: function textField() {
    // Default textfield to rendered output.
    var textField = function (item) {
      if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== 'object') {
        return item;
      }
      return (0, _util.interpolate)(this.props.component.template, { item: item });
    }.bind(this);
    if (typeof this.getTextField === 'function') {
      textField = this.getTextField();
    }
    return textField;
  },
  onChangeSelect: function onChangeSelect(value) {
    if (Array.isArray(value) && this.valueField()) {
      value.forEach(function (val, index) {
        value[index] = (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? (0, _get3.default)(val, this.valueField()) : val;
      }.bind(this));
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && this.valueField()) {
      value = (0, _get3.default)(value, this.valueField());
    }
    this.setValue(value);
  },
  onSearch: function onSearch(text) {
    this.setState({
      searchTerm: text
    });
    if (typeof this.refreshItems === 'function') {
      this.refreshItems(text);
    }
  },
  onToggle: function onToggle(isOpen) {
    this.props.onEvent('selectToggle', this, isOpen);
    this.setState(function (prevState) {
      prevState.open = isOpen;
      return prevState;
    });
  },
  itemComponent: function itemComponent() {
    var component = this.props.component;

    if (!component.template) {
      return null;
    }
    var items = [];

    if (component.dataSrc === 'json') {
      if (typeof component.data.json === 'string') {
        items = JSON.parse(component.data.json);
      } else if (_typeof(component.data.json) === 'object') {
        items = component.data.json;
      }
    }

    return _react2.default.createClass({
      render: function render() {
        var item = this.props.item;

        if (component.dataSrc === 'values') {
          // Search for the full item from values.
          item = _.find(component.data.values, { value: item }) || item;
        } else if (component.dataSrc === 'json' && component.valueProperty && item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== 'object') {
          item = _.find(items, _defineProperty({}, component.valueProperty, item)) || item;
        }

        if (item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
          // Render the markup raw under this react element
          return _react2.default.createElement('span', (0, _util.raw)((0, _util.interpolate)(component.template, { item: item })));
        }

        return _react2.default.createElement('span', {}, item);
      }
    });
  },
  listComponent: function listComponent() {
    var root = this;
    return function (_List) {
      _inherits(_class, _List);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
      }

      _createClass(_class, [{
        key: 'render',
        value: function render() {
          var loadMore;
          if (root.state.hasNextPage) {
            loadMore = _react2.default.createElement(
              'span',
              { className: 'btn btn-success btn-block', onClick: root.loadMoreItems },
              'Load More...'
            );
          }
          return _react2.default.createElement(
            'div',
            { className: 'wrapper' },
            _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'render', this).call(this),
            loadMore
          );
        }
      }]);

      return _class;
    }(_List3.default);
  },
  getElements: function getElements() {
    var _this2 = this;

    var Element;
    var properties = {
      data: this.state.selectItems.filter(function (value) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && _this2.valueField()) {
          value = (0, _get3.default)(value, _this2.valueField());
        }
        return _this2.state.value !== value;
      }),
      placeholder: this.props.component.placeholder,
      textField: this.textField(),
      value: this.state.value,
      disabled: this.props.readOnly,
      onChange: this.onChangeSelect,
      itemComponent: this.itemComponent(),
      listComponent: this.listComponent(),
      duration: 10,
      open: this.state.open,
      onToggle: this.onToggle
    };
    if (this.valueField()) {
      properties.valueField = this.valueField();
    }
    var classLabel = 'control-label' + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? _react2.default.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    var requiredInline = !this.props.component.label && this.props.component.validate && this.props.component.validate.required ? _react2.default.createElement('span', { className: 'glyphicon glyphicon-asterisk form-control-feedback field-required-inline', 'aria-hidden': 'true' }) : '';
    var className = this.props.component.prefix || this.props.component.suffix ? 'input-group' : '';
    if (!this.internalFilter) {
      // Disable internal filtering.
      properties.filter = function (dataItem, searchTerm) {
        return true;
      };
      properties.searchTerm = this.state.searchTerm;
      properties.onSearch = this.onSearch;
    } else {
      properties.filter = 'contains';
    }
    if (this.props.component.multiple) {
      properties.tagComponent = this.itemComponent();
      Element = _react2.default.createElement(_Multiselect2.default, properties);
    } else {
      properties.valueComponent = this.itemComponent();
      Element = _react2.default.createElement(_DropdownList2.default, properties);
    }
    return _react2.default.createElement(
      'div',
      null,
      inputLabel,
      ' ',
      requiredInline,
      _react2.default.createElement(
        'div',
        { className: className },
        Element
      )
    );
  }
};