import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Checkbox from './checkbox.jsx';
import sinon from 'sinon';

import form from '../../../test/forms/empty.json';

describe('Checkbox', function () {
  describe('Checkbox field', function () {
    var component= {
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "checkbox",
      "validate": {
        "required": false
      },
      "persistent": true,
      "protected": false,
      "defaultValue": false,
      "key": "checkbox",
      "label": "Checkbox",
      "hideLabel": true,
      "tableView": true,
      "inputType": "checkbox",
      "input": true
    };
    var attachToForm = sinon.spy();
    it('Renders a checkbox field', function (done) {
      const element = render(
        <Checkbox
      component={component}
      attachToForm={attachToForm}
        ></Checkbox>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-checkbox form-group-checkbox')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-checkbox');
      expect(element.find('.checkbox label').length).to.equal(1);
      expect(element.find('.checkbox label').html()).to.equal('<input type="checkbox" id="checkbox">Checkbox');
      expect(element.find('.checkbox input').length).to.equal(1);
      expect(element.find('.checkbox').attr('class')).to.equal('checkbox');
      expect(element.find('.checkbox input').attr('type')).to.equal('checkbox');
      expect(element.find('.checkbox input').attr('id')).to.equal('checkbox');
      done();
    });

    it('Renders a checkbox field without a label', function (done) {
      component.hideLabel = true;
      component.datagridLabel = false;
      const element = render(
        <Checkbox
      component={component}
      attachToForm={attachToForm}
        ></Checkbox>
      ).children().eq(0);
      expect(element.find('.checkbox label').html()).to.equal('<input type="checkbox" id="checkbox">');
      delete component.datagridLabel;
      done();
    });

    it('Renders a checkbox field with a label when variables set', function (done) {
      component.hideLabel = false;
      component.datagridLabel = false;
      const element = render(
        <Checkbox
      component={component}
      attachToForm={attachToForm}
        ></Checkbox>
      ).children().eq(0);
      expect(element.find('.checkbox label').html()).to.equal('<input type="checkbox" id="checkbox">Checkbox');
      delete component.datagridLabel;
      component.hideLabel = true;
      done();
    });

    it('Renders a checkbox field with a label when variables set', function (done) {
      component.hideLabel = true;
      component.datagridLabel = true;
      const element = render(
        <Checkbox
      component={component}
      attachToForm={attachToForm}
        ></Checkbox>
      ).children().eq(0);
      expect(element.find('.checkbox label').html()).to.equal('<input type="checkbox" id="checkbox">Checkbox');
      delete component.datagridLabel;
      component.hideLabel = true;
      done();
    });

    it('Renders a checkbox field with a label when variables set', function (done) {
      component.hideLabel = false;
      component.datagridLabel = true;
      const element = render(
        <Checkbox
      component={component}
      attachToForm={attachToForm}
        ></Checkbox>
      ).children().eq(0);
      expect(element.find('.checkbox label').html()).to.equal('<input type="checkbox" id="checkbox">Checkbox');
      delete component.datagridLabel;
      component.hideLabel = true;
      done();
    });

    it('Sets a default value as true', function(done) {
      component.defaultValue = true;
      const element = render(
        <Checkbox
      component={component}
      value={component.defaultValue}
      attachToForm={attachToForm}
        ></Checkbox>
      ).find('#checkbox');
      expect(element.attr('checked')).to.equal('checked');
      component.defaultValue = false;
      done();
    });

    it('Check the validations', function(done) {
      component.validate.required = true;
      const element = render(
        <Checkbox
      component={component}
      attachToForm={attachToForm}
        ></Checkbox>
      );
      expect(element.find('.checkbox label').attr('class')).to.equal('control-label field-required not-checked');
      done();
    });

    it('Sets the checked class when selected', function(done) {
      const element = mount(
        <Checkbox
          component={component}
          attachToForm={attachToForm}
        ></Checkbox>
      );
      expect(element.find('label').hasClass('not-checked')).to.equal(true);
      element.find('input').simulate('change', {"target": {"checked": true}});
      expect(element.find('label').hasClass('checked')).to.equal(true);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Checkbox
          component={component}
          attachToForm={attachToForm}
        ></Checkbox>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });
  });

});
