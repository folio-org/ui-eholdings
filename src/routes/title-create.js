import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import Title from '../redux/title';
import Package from '../redux/package';

import View from '../components/title/create';

class TitleCreateRoute extends Component {
  static propTypes = {
    createRequest: PropTypes.object.isRequired,
    customPackages: PropTypes.object.isRequired,
    createTitle: PropTypes.func.isRequired,
    getCustomPackages: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        replace: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  componentDidMount() {
    this.props.getCustomPackages();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.createRequest.isResolved && this.props.createRequest.isResolved) {
      this.context.router.history.replace(
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
  ]

  mergeIdentifiers = (identifiers) => {
    return identifiers.map(({ id, type, subtype }) => {
      let mergedTypeIndex = 0;

      if (type && subtype) {
        mergedTypeIndex = this.flattenedIdentifiers.filter(row =>
          row.type === type && row.subtype === subtype);
      }

      return {
        id,
        flattenedType: mergedTypeIndex
      };
    });
  }

  expandIdentifiers = (identifiers) => {
    return identifiers.map(({ id, flattenedType }) => {
      let flattenedTypeIndex = flattenedType || 0;
      return { id, ...this.flattenedIdentifiers[flattenedTypeIndex] };
    });
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
      createRequest,
      customPackages
    } = this.props;

    return (
      <View
        request={createRequest}
        customPackages={customPackages}
        onSubmit={this.createTitle}
        initialValues={{
          name: '',
          edition: '',
          publisherName: '',
          publicationType: 'Unspecified',
          isPeerReviewed: false,
          contributors: [],
          identifiers: [],
          description: '',
          packageId: ''
        }}
      />
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
        count: 100
      })
    };
  }, {
    createTitle: attrs => Title.create(attrs),
    getCustomPackages: () => Package.query({
      filter: { custom: true },
      count: 100
    })
  }
)(TitleCreateRoute);
