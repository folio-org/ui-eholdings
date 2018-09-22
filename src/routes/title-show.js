import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { TitleManager } from '@folio/stripes-core';

import { createResolver } from '../redux';
import Title from '../redux/title';
import Package from '../redux/package';
import Resource from '../redux/resource';
import View from '../components/title/show';

class TitleShowRoute extends Component {
  static propTypes = {
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    customPackages: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
    getCustomPackages: PropTypes.func.isRequired,
    createResource: PropTypes.func.isRequired,
    createRequest: PropTypes.object.isRequired,
    history: ReactRouterPropTypes.history.isRequired
  };

  componentDidMount() {
    let { match, getTitle, getCustomPackages } = this.props;
    let { titleId } = match.params;

    getTitle(titleId);
    getCustomPackages();
  }

  componentDidUpdate(prevProps) {
    let { match, createRequest } = prevProps;
    let { titleId } = this.props.match.params;

    if (match.params.titleId !== titleId) {
      this.props.getTitle(titleId);
    }

    if (!createRequest.isResolved && this.props.createRequest.isResolved) {
      this.props.history.push(
        `/eholdings/resources/${this.props.createRequest.records[0]}`,
        { eholdings: true, isNewRecord: true }
      );
    }
  }

  createResource = ({ packageId, customUrl }) => {
    let { match, createResource } = this.props;
    let { titleId } = match.params;

    createResource({
      url: customUrl,
      packageId,
      titleId
    });
  };

  render() {
    let { model, customPackages, createRequest } = this.props;

    return (
      <TitleManager record={this.props.model.name}>
        <View
          request={createRequest}
          model={model}
          customPackages={customPackages}
          addCustomPackage={this.createResource}
        />
      </TitleManager>
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => {
    let resolver = createResolver(data);

    return {
      model: resolver.find('titles', match.params.titleId),
      createRequest: resolver.getRequest('create', { type: 'resources' }),
      customPackages: resolver.query('packages', {
        filter: { custom: true },
        count: 100
      })
    };
  }, {
    getTitle: id => Title.find(id, { include: 'resources' }),
    createResource: attrs => Resource.create(attrs),
    getCustomPackages: () => Package.query({
      filter: { custom: true },
      count: 100
    })
  }
)(TitleShowRoute);
