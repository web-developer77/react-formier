import React from 'react';
import valueMixin from './mixins/valueMixin';
import selectMixin from './mixins/selectMixin';
import componentMixin from './mixins/componentMixin';
import formiojs from 'formiojs';
import { interpolate, serialize, raw } from '../../util';
import get from 'lodash/get';
import debounce from 'lodash/debounce';

module.exports = React.createClass({
  options: {},
  lastInput: '',
  displayName: 'Select',
  mixins: [valueMixin, selectMixin, componentMixin],
  getValueField: function() {
    if (this.props.component.dataSrc === 'values') {
      return 'value';
    }
    if (this.props.component.dataSrc === 'custom') {
      return false;
    }
    if (this.props.component.dataSrc === 'resource' && this.props.component.valueProperty === '') {
      return '_id';
    }
    if (this.props.component.valueProperty) {
      return this.props.component.valueProperty;
    }
    return false;
  },
  componentWillMount: function() {
    switch (this.props.component.dataSrc) {
      case 'values':
        this.internalFilter = true;
        this.setState({
          selectItems: this.props.component.data.values
        });
        break;
      case 'json':
        try {
          if (typeof this.props.component.data.json === 'string') {
            this.items = JSON.parse(this.props.component.data.json);
          }
          else if (typeof this.props.component.data.json === 'object') {
            this.items = this.props.component.data.json;
          }
          else {
            this.items = [];
          }
        }
        catch (error) {
          console.warn('Error parsing JSON in ' + this.props.component.key, error);
          this.items = [];
        }
        this.options.params = {
          limit: parseInt(this.props.component.limit) || 20,
          skip: 0
        };
        // Pre-render all items to make them filter faster.
        this.items.map(item => {
          item.render = interpolate(this.props.component.template, {item}).replace(/<(?:.|\n)*?>/gm, '');
          return item;
        });
        this.refreshItems = (input, url, append) => {
          // If they typed in a search, reset skip.
          if ((this.lastInput || input) && this.lastInput !== input) {
            this.lastInput = input;
            this.options.params.skip = 0;
          }
          let items = this.items;
          if (input) {
            items = items.filter(item => {
              switch (this.props.component.filter) {
                case 'startsWith':
                  return item.render.toLowerCase().lastIndexOf(input.toLowerCase(), 0) === 0;
                  break;
                case 'contains':
                default:
                  return item.render.toLowerCase().indexOf(input.toLowerCase()) !== -1;
                  break;
              }
            });
          }
          items = items.slice(this.options.params.skip, this.options.params.skip + this.options.params.limit);
          this.setResult(items, append);
        };
        this.refreshItems();
        break;
      case 'custom':
        this.refreshItems = (input) => {
          try {
            /* eslint-disable no-unused-vars */
            const { data, row } = this.props;
            /* eslint-enable no-unused-vars */
            let selectItems = eval('(function(data, row, input) { var values = [];' + this.props.component.data.custom.toString() + '; return values; })(data, row, input)');
            if (!Array.isArray(selectItems)) {
              throw 'Didn\'t return an array.';
            }
            this.setState({
              selectItems
            });
          }
          catch (error) {
            console.warn('Error calculating select components in ' + this.props.component.key, error);
            this.setState({
              selectItems: []
            });
          }
        };
        this.refreshItems();
        break;
      case 'resource':
      case 'url':
        if (this.props.component.dataSrc === 'url') {
          this.url = this.props.component.data.url;
          if (this.url.substr(0, 1) === '/') {
            this.url = formiojs.getBaseUrl() + this.props.component.data.url;
          }

          this.options = {
            headers: new Headers({
              'Pragma': undefined,
              'Cache-Control': undefined
            })
          };

          // Disable auth for outgoing requests.
          if (!this.props.component.authenticate && this.url.indexOf(formiojs.getBaseUrl()) === -1) {
            this.options.disableJWT = 'true';
            this.options.headers.set('Authorization', undefined);
          }

          this.props.component.data.headers.forEach((header) => {
            this.options.headers.set(header.key, header.value);
          });
        }
        else {
          this.url = formiojs.getBaseUrl();
          if (this.props.component.data.project) {
            this.url += '/project/' + this.props.component.data.project;
          }
          this.url += '/form/'  + this.props.component.data.resource + '/submission';
        }

        this.options.params = {
          limit: this.props.component.limit || 100,
          skip: 0
        };

        this.refreshItems = (input, newUrl, append) => {
          let { data, row } = this.props;
          newUrl = newUrl || this.url;
          // Allow templating the url.
          newUrl = interpolate(newUrl, {
            data,
            row,
            formioBase: formiojs.getBaseUrl()
          });
          if (!newUrl) {
            return;
          }

          // If this is a search, then add that to the filter.
          if (this.props.component.searchField && input) {
            // If they typed in a search, reset skip.
            if (this.lastInput !== input) {
              this.lastInput = input;
              this.options.params.skip = 0;
            }
            newUrl += ((newUrl.indexOf('?') === -1) ? '?' : '&') +
              encodeURIComponent(this.props.component.searchField) +
              '=' +
              encodeURIComponent(input);
          }

          // Add the other filter.
          if (this.props.component.filter) {
            var filter = interpolate(this.props.component.filter, {data});
            newUrl += ((newUrl.indexOf('?') === -1) ? '?' : '&') + filter;
          }

          // If they wish to return only some fields.
          if (this.props.component.selectFields) {
            this.options.params.select = this.props.component.selectFields;
          }

          // If this is a search, then add that to the filter.
          newUrl += ((newUrl.indexOf('?') === -1) ? '?' : '&') + serialize(this.options.params);
          formiojs.request(newUrl).then(data => {
            // If the selectValue prop is defined, use it.
            if (this.props.component.selectValues) {
              this.setResult(get(data, this.props.component.selectValues, []), append);
            }
            // Attempt to default to the formio settings for a resource.
            else if (data.hasOwnProperty('data')) {
              this.setResult(data.data, append);
            }
            else if (data.hasOwnProperty('items')) {
              this.setResult(data.items, append);
            }
            // Use the data itself.
            else {
              this.setResult(data, append);
            }
          });
        }

        this.refreshItems();

        break;
      default:
        this.setState({
          selectItems: []
        });
    }
  },
  refreshItems: function() {},
  loadMoreItems: function(event) {
    event.stopPropagation();
    event.preventDefault();
    this.props.onEvent('loadMore', this);
    this.options.params.skip += this.options.params.limit;
    this.refreshItems(null, null, true);
  },
  setResult: function(data, append) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    this.setState(function(previousState) {
      if (append) {
        previousState.selectItems = previousState.selectItems.concat(data);
      }
      else {
        previousState.selectItems = data;
      }
      previousState.hasNextPage = previousState.selectItems.length >= (this.options.params.limit + this.options.params.skip);
      return previousState;
    });
  },
  getValueDisplay: function(component, data) {
    var getItem = function(data) {
      switch (component.dataSrc) {
        case 'values':
          component.data.values.forEach(function(item) {
            if (item.value === data) {
              data = item;
            }
          });
          return data;
        case 'json':
          if (component.valueProperty) {
            var selectItems;
            try {
              selectItems = angular.fromJson(component.data.json);
            }
            catch (error) {
              selectItems = [];
            }
            selectItems.forEach(function(item) {
              if (item[component.valueProperty] === data) {
                data = item;
              }
            });
          }
          return data;
        // TODO: implement url and resource view.
        case 'url':
        case 'resource':
        default:
          return data;
      }
    };
    if (component.multiple && Array.isArray(data)) {
      return data.map(getItem).reduce(function(prev, item) {
        var value;
        if (typeof item === 'object') {
          value = React.createElement('span', raw(interpolate(component.template, {item})));
        }
        else {
          value = item;
        }
        return (prev === '' ? '' : ', ') + value;
      }, '');
    }
    else {
      var item = getItem(data);
      var value;
      if (typeof item === 'object') {
        value = React.createElement('span', raw(interpolate(component.template, {item})));
      }
      else {
        value = item;
      }
      return value;
    }
  }
});
