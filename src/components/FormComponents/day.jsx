import React from 'react';
import createReactClass from 'create-react-class';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';
import componentMixin from './mixins/componentMixin';
import Input from 'react-text-mask';

module.exports = createReactClass({
  displayName: 'Textfield',
  noErrorClass: true,
  mixins: [valueMixin, multiMixin, componentMixin],
  getInitialValue: function() {
    return '00/00/0000';
  },
  onChangeCustom: function(config, event) {
    const { value } = event.target;
    // Don't fire a change if the value didn't change.
    if (value === this.state.date[config.key]) {
      return;
    }
    this.setState(state => {
      state.date[config.key] = value;
      return state;
    }, () => {
      const padLeft = function padLeft(nr, n, str) {
        return Array(n - String(nr.toString()).length + 1).join(str || '0') + nr.toString();
      };
      const { date } = this.state;

      if (this.props.component.dayFirst) {
        this.setValue(padLeft(date.day, 2) + '/' + padLeft(date.month, 2) + '/' + padLeft(date.year, 4));
      }
      else {
        this.setValue(padLeft(date.month, 2) + '/' + padLeft(date.day, 2) + '/' + padLeft(date.year, 4));
      }
    });
  },
  validateCustom: function(value) {
    const required = this.props.component.fields.day.required || this.props.component.fields.month.required || this.props.component.fields.year.required;
    let state = {
      isValid: true,
      errorType: '',
      errorMessage: ''
    };
    if (!required) {
      return state;
    }
    if (!value && required) {
      state = {
        isValid: false,
        errorMessage: (this.props.component.label || this.props.component.key) + ' must be a valid date.'
      };
    }
    var parts = value.split('/');
    if (this.props.component.fields.day.required) {
      if (parts[(this.props.component.dayFirst ? 0 : 1)] === '00') {
        state = {
          isValid: false,
          errorType: 'day',
          errorMessage: (this.props.component.label || this.props.component.key) + ' must be a valid date.'
        };
      }
    }
    if (this.props.component.fields.month.required) {
      if (parts[(this.props.component.dayFirst ? 1 : 0)] === '00') {
        state = {
          isValid: false,
          errorType: 'day',
          errorMessage: (this.props.component.label || this.props.component.key) + ' must be a valid date.'
        };
      }
    }
    if (this.props.component.fields.year.required) {
      if (parts[2] === '0000') {
        state = {
          isValid: false,
          errorType: 'day',
          errorMessage: (this.props.component.label || this.props.component.key) + ' must be a valid date.'
        };
      }
    }
    return state;
  },
  customState: function(state) {
    state.date = {
      day: '',
      month: '',
      year: ''
    };
    if (state.value) {
      var parts = state.value.split('/');
      state.date.day = parseInt(parts[(this.props.component.dayFirst ? 0 : 1)]);
      state.date.month = parseInt(parts[(this.props.component.dayFirst ? 1 : 0)]).toString();
      state.date.year = parseInt(parts[2]);
    }
    return state;
  },
  willReceiveProps: function(nextProps) {
    if (this.state.value !== nextProps.value) {
      if (!nextProps.value) {
        return;
      }
      var parts = nextProps.value.split('/');
      this.setState({
        date: {
          day: parts[(this.props.component.dayFirst ? 0 : 1)],
          month: parseInt(parts[(this.props.component.dayFirst ? 1 : 0)]).toString(),
          year: parts[2]
        }
      });
    }
  },
  getDatePart: function(config) {
    const classes = 'control-label' + (config.required ? ' field-required' : '');

    const mask = Array(config.characters).fill(/\d/);

    const pipe = (value) => {
      if (
        parseInt(value) < parseInt(config.min) ||
        parseInt(value) > parseInt(config.max)
      ) {
        return false;
      }
      return value;
    };

    const errorClass = (
      !this.state.isPristine &&
      config.required &&
      !this.state.date[config.key]
    ) ? ' has-error' : '';

    return (
      <div className={`form-group col-xs-${config.columns}${errorClass}`}>
        <label htmlFor={config.componentId} className={classes}>{config.title}</label>
        <Input
          className='form-control'
          type='text'
          id={config.componentId}
          style={{paddingRight: '10px'}}
          placeholder={config.placeholder}
          value={this.state.date[config.key] !== 0 ? this.state.date[config.key] : ''}
          onChange={this.onChangeCustom.bind(null, config)}
          mask={mask}
          pipe={pipe}
          guide={false}
          disabled={this.props.readOnly}
        />
      </div>
    );
  },
  getDay: function(componentId, field) {
    if (field.hide) {
      return null;
    }
    return this.getDatePart({
      key: 'day',
      componentId: componentId + '-day',
      title: 'Day',
      placeholder: field.placeholder,
      required: field.required,
      columns: 3,
      min: 0,
      max: 31,
      characters: 2
    });
  },
  getMonth: function(componentId, field) {
    if (field.hide) {
      return null;
    }
    const classes = 'control-label' + (field.required ? ' field-required' : '');
    const options = [field.placeholder, 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const errorClass = (
      !this.state.isPristine &&
      field.required &&
      !this.state.date.month
    ) ? ' has-error' : '';

    return (
      <div className={`form-group col-xs-4${errorClass}`}>
        <label htmlFor={componentId + '-month'} className={classes}>Month</label>
        <select className='form-control'
          type='text'
          id={componentId + '-month'}
          disabled={this.props.readOnly}
          value={this.state.date.month}
          onChange={this.onChangeCustom.bind(null, {key: 'month'})}
        >
          {options.map((month, index) => {
            return (
              <option value={index} key={index}>{month}</option>
            );
          })}
        </select>
      </div>
    );
  },
  getYear: function(componentId, field) {
    if (field.hide) {
      return null;
    }
    return this.getDatePart({
      key: 'year',
      componentId: componentId + '-year',
      title: 'Year',
      placeholder: field.placeholder,
      required: field.required,
      columns: 5,
      min: 0,
      max: 2100,
      characters: 4
    });
  },
  getSingleElement: function(value, index) {
    let { component } = this.props;
    return (
      <div className='day-input'>
        <div className='daySelect form row'>
          {(component.dayFirst ? this.getDay(component.key, component.fields.day) : this.getMonth(component.key, component.fields.month))}
          {(component.dayFirst ? this.getMonth(component.key, component.fields.month) : this.getDay(component.key, component.fields.day))}
          {this.getYear(component.key, component.fields.year)}
        </div>
      </div>
    );
  }
});
