import React from 'react';
import valueMixin from './mixins/valueMixin';
import selectMixin from './mixins/selectMixin';
import componentMixin from './mixins/componentMixin';
import debounce from 'lodash/debounce';

module.exports = React.createClass({
  displayName: 'Address',
  mixins: [valueMixin, selectMixin, componentMixin],
  getTextField: function() {
    return 'formatted_address';
  },
  getValueField: function() {
    return null;
  },
  doSearch: debounce(function(text) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + text + '&sensor=false')
      .then(function(response) {
        response.json().then(function(data) {
          this.setState({
            selectItems: data.results
          });
        }.bind(this));
      }.bind(this));
  }, 200),
  getValueDisplay: function(component, data) {
    return data ? data.formatted_address : '';
  }
});
