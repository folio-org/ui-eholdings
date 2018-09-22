import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { TitleManager } from '@folio/stripes-core';

import { createResolver } from '../redux';
import Package from '../redux/package';

import View from '../components/package/create';

class PackageCreateRoute extends Component {
  static propTypes = {
    createPackage: PropTypes.func.isRequired,
    createRequest: PropTypes.object.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired
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
    let attrs = {};

    if (values.customCoverages[0]) {
      attrs.customCoverage = {
        beginCoverage: !values.customCoverages[0].beginCoverage ? '' :
          moment(values.customCoverages[0].beginCoverage).tz('UTC').format('YYYY-MM-DD'),
        endCoverage: !values.customCoverages[0].endCoverage ? '' :
          moment(values.customCoverages[0].endCoverage).tz('UTC').format('YYYY-MM-DD')
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
    const { history, location } = this.props;

    return (
      <TitleManager record="New custom package">
        <View
          request={this.props.createRequest}
          onSubmit={this.packageCreateSubmitted}
          onCancel={() => (location.state && location.state.eholdings
            ? history.goBack()
            : history.push({
              pathname: '/eholdings',
              search: 'searchType=packages',
              state: { eholdings: true }
            }))
          }
          initialValues={{
            name: '',
            contentType: 'Unknown',
            customCoverages: []
          }}
        />
      </TitleManager>
    );
  }
}

export default connect(
  ({ eholdings: { data } }) => ({
    createRequest: createResolver(data).getRequest('create', { type: 'packages' })
  }), {
    createPackage: attrs => Package.create(attrs)
  }
)(PackageCreateRoute);
