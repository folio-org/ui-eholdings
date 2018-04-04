import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import Package from '../redux/package';

import View from '../components/package/create';

class PackageCreateRoute extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    updatePackage: PropTypes.func.isRequired
  };

  packageCreateSubmitted = (values) => {
    let { model, updatePackage } = this.props;
    model.name = values.name;
    updatePackage(model);
  };

  render() {
    return (
      <View
        model={this.props.model}
        onSubmit={this.packageCreateSubmitted}
        initialValues={{
          name: ''
        }}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }) => ({
    model: createResolver(data).create('packages')
  }), {
    updatePackage: model => Package.save(model)
  }
)(PackageCreateRoute);
