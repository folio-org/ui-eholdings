import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { TitleManager } from '@folio/stripes/core';

import { createResolver } from '../redux';
import Title from '../redux/title';
import Package from '../redux/package';

import View from '../components/title/create';

class TitleCreateRoute extends Component {
  static propTypes = {
    createRequest: PropTypes.object.isRequired,
    createTitle: PropTypes.func.isRequired,
    customPackages: PropTypes.object.isRequired,
    getCustomPackages: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    removeCreateRequests: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getCustomPackages();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.createRequest.isResolved && this.props.createRequest.isResolved) {
      this.props.history.replace(
        `/eholdings/titles/${this.props.createRequest.records[0]}`,
        { eholdings: true, isNewRecord: true }
      );
    }
  }

  flattenedIdentifiers = [
    { type: 'ISSN', subtype: 'Online' },
    { type: 'ISSN', subtype: 'Print' },
    { type: 'ISBN', subtype: 'Online' },
    { type: 'ISBN', subtype: 'Print' }
  ];

  expandIdentifiers = (identifiers) => {
    return identifiers ? identifiers.map(({ id, flattenedType }) => {
      let flattenedTypeIndex = flattenedType || 0;
      return { id, ...this.flattenedIdentifiers[flattenedTypeIndex] };
    }) : [];
  }

  createTitle = (values) => {
    let { packageId, ...attrs } = values;

    // a resource is created along with the title
    attrs.resources = [{ packageId }];

    this.props.createTitle(Object.assign(attrs, {
      identifiers: this.expandIdentifiers(attrs.identifiers)
    }));
  };

  render() {
    let {
      customPackages,
      history,
      location,
      removeCreateRequests,
    } = this.props;

    let onCancel;
    if (location.state && location.state.eholdings) {
      onCancel = () => history.goBack();
    }

    return (
      <TitleManager record="New custom title">
        <View
          request={this.props.createRequest}
          customPackages={customPackages}
          onSubmit={this.createTitle}
          onCancel={onCancel}
          removeCreateRequests={removeCreateRequests}
        />
      </TitleManager>
    );
  }
}

export default connect(
  ({ eholdings: { data } }) => {
    let resolver = createResolver(data);

    return {
      createRequest: resolver.getRequest('create', { type: 'titles' }),
      customPackages: resolver.query('packages', {
        filter: { custom: true },
        count: 100,
        pageSize: 100,
      })
    };
  }, {
    createTitle: attrs => Title.create(attrs),
    removeCreateRequests: () => Title.removeCreateRequests(),
    getCustomPackages: () => Package.query({
      filter: { custom: true },
      count: 100,
      pageSize: 100,
    })
  }
)(TitleCreateRoute);
