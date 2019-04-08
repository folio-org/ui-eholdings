import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { TitleManager } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';

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
      const flattenedTypeIndex = flattenedType || 0;
      return { id, ...this.flattenedIdentifiers[flattenedTypeIndex] };
    }) : [];
  }

  createTitle = (values) => {
    const { packageId, ...attrs } = values;

    // a resource is created along with the title
    attrs.resources = [{ packageId }];

    this.props.createTitle(Object.assign(attrs, {
      identifiers: this.expandIdentifiers(attrs.identifiers)
    }));
  };

  render() {
    const {
      customPackages,
      history,
      location,
      removeCreateRequests,
      createRequest,
    } = this.props;

    let onCancel;
    if (location.state && location.state.eholdings) {
      onCancel = () => history.goBack();
    }

    return (
      <FormattedMessage id="ui-eholdings.label.create.title">
        {pageTitle => (
          <TitleManager record={pageTitle}>
            <View
              request={createRequest}
              customPackages={customPackages}
              onSubmit={this.createTitle}
              onCancel={onCancel}
              removeCreateRequests={removeCreateRequests}
            />
          </TitleManager>
        )}
      </FormattedMessage>
    );
  }
}

export default connect(
  ({ eholdings: { data } }) => {
    const resolver = createResolver(data);

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
    removeCreateRequests: () => Title.removeRequests('create'),
    getCustomPackages: () => Package.query({
      filter: { custom: true },
      count: 100,
      pageSize: 100,
    })
  }
)(TitleCreateRoute);
