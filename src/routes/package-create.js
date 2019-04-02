import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { TitleManager } from '@folio/stripes/core';

import { createResolver } from '../redux';
import Package from '../redux/package';

import View from '../components/package/create';

class PackageCreateRoute extends Component {
  static propTypes = {
    createPackage: PropTypes.func.isRequired,
    createRequest: PropTypes.object.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    removeCreateRequests: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.createRequest.isResolved && this.props.createRequest.isResolved) {
      this.props.history.replace(
        `/eholdings/packages/${this.props.createRequest.records[0]}`,
        { eholdings: true, isNewRecord: true }
      );
    }
  }

  packageCreateSubmitted = (values) => {
    const attrs = {};

    if (values.customCoverages[0]) {
      attrs.customCoverage = {
        beginCoverage: !values.customCoverages[0].beginCoverage ? '' :
          moment.utc(values.customCoverages[0].beginCoverage).format('YYYY-MM-DD'),
        endCoverage: !values.customCoverages[0].endCoverage ? '' :
          moment.utc(values.customCoverages[0].endCoverage).format('YYYY-MM-DD')
      };
    }

    if ('name' in values) {
      attrs.name = values.name;
    }

    if ('contentType' in values) {
      attrs.contentType = values.contentType;
    }

    this.props.createPackage(attrs);
  };

  render() {
    const {
      history,
      location,
      removeCreateRequests,
    } = this.props;
    let onCancel;
    if (location.state && location.state.eholdings) {
      onCancel = () => history.goBack();
    }

    return (
      <TitleManager record="New custom package">
        <View
          request={this.props.createRequest}
          onSubmit={this.packageCreateSubmitted}
          onCancel={onCancel}
          removeCreateRequests={removeCreateRequests}
        />
      </TitleManager>
    );
  }
}

export default connect(
  ({ eholdings: { data } }) => ({
    createRequest: createResolver(data).getRequest('create', { type: 'packages', pageSize: 100 })
  }), {
    createPackage: attrs => Package.create(attrs),
    removeCreateRequests: () => Package.removeRequests('create'),
  }
)(PackageCreateRoute);
