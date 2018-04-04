import React from 'react';
import valueMixin from './mixins/valueMixin';
import componentMixin from './mixins/componentMixin';
import SignatureCanvas from 'react-signature-canvas';

module.exports = React.createClass({
  displayName: 'Signature',
  mixins: [valueMixin, componentMixin],
  onEnd: function() {
    this.setValue(this.signature.getCanvas().toDataURL());
  },
  componentDidMount: function() {
    if (!this.signature) {
      return;
    }
    if (this.state.value) {
      this.signature.fromDataURL(this.state.value);
    }
    else {
      this.signature.clear();
    }
  },
  willReceiveProps: function(nextProps) {
    if (!this.signature) {
      return;
    }
    if (this.props.value !== nextProps.value) {
      this.signature.fromDataURL(nextProps.value);
    }
  },
  clearSignature: function() {
    this.signature.clear();
    this.setValue(null);
  },
  getElements: function() {
    const { component } = this.props;
    var footerClass = 'formio-signature-footer' + (component.validate.required ? ' field-required' : '');
    var ref = component.key;
    var styles = {
      height: component.height,
      width: component.width
    };
    if (this.props.readOnly) {
      return (
        <div className="m-signature-pad" style={styles}>
          <img alt="Signature" className="signature-canvas" src={this.state.value} />
        </div>
      );
    }
    return (
      <div>
        <span className=" glyphicon glyphicon-refresh"  onClick={this.clearSignature}/>
        <div className="m-signature-pad">
          <div className="m-signature-pad--body" style={styles}>
            <SignatureCanvas
              ref={ (ref) => { this.signature = ref; } }
              minWidth={Number(component.minWidth)}
              maxWidth={Number(component.maxWidth)}
              penColor={component.penColor}
              backgroundColor={component.backgroundColor}
              canvasProps={{
                className: 'signature-canvas'
              }}
              clearOnResize={false}
              onEnd={this.onEnd}
            />
          </div>
        </div>
        <div className={footerClass}>{component.footer}</div>
      </div>
    );
  }
});
