import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import Package from '../redux/package';

import View from '../components/package/create';

class PackageCreateRoute extends Component {
  static propTypes = {
    request: PropTypes.object.isRequired,
    createPackage: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        replace: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.request.isResolved && this.props.request.isResolved) {
      let packageId = this.props.request.records[0];
      this.context.router.history.replace(`/eholdings/packages/${packageId}`, { eholdings: true });
    }
  }

  packageCreateSubmitted = (values) => {
    this.props.createPackage(values);
  };

  render() {
    return (
      <View
        request={this.props.request}
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
    request: createResolver(data).getRequest('create', { type: 'packages' })
  }), {
    createPackage: attrs => Package.create(attrs)
  }
)(PackageCreateRoute);
