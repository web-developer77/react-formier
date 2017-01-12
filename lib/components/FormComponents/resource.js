'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _selectMixin = require('./mixins/selectMixin');

var _selectMixin2 = _interopRequireDefault(_selectMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

var _util = require('../../util');

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Resource',
  mixins: [_valueMixin2.default, _selectMixin2.default, _componentMixin2.default],
  componentWillMount: function componentWillMount() {
    this.formio = new _formiojs2.default(_formiojs2.default.getBaseUrl() + '/project/' + this.props.component.project + '/form/' + this.props.component.resource);
    this.refreshItems();
  },
  getValueField: function getValueField() {
    // This will cause the whole object to be returned.
    return false;
  },
  refreshItems: function refreshItems(text) {
    var settings = this.props.component;
    if (settings.resource) {
      var params = {
        limit: 9999
      };

      // If they wish to filter the results.
      if (settings.selectFields) {
        params.select = settings.selectFields;
      }

      if (settings.searchFields && Array.isArray(settings.searchFields) && text) {
        settings.searchFields.forEach(function (field) {
          params[field] = text;
        });
      }

      // Load the submissions.
      this.formio.loadSubmissions({
        params: params
      }).then(function (submissions) {
        this.setState({
          selectItems: submissions
        });
      }.bind(this));
    }
  },
  getValueDisplay: function getValueDisplay(component, data) {
    return _react2.default.createElement('span', (0, _util.raw)((0, _util.interpolate)(component.template, { item: data })));
  }
});