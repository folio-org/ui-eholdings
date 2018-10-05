import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { TitleManager } from '@folio/stripes/core';

import { createResolver } from '../redux';
import Resource from '../redux/resource';
import View from '../components/resource/show';
import { ProxyType } from '../redux/application';

class ResourceShowRoute extends Component {
  static propTypes = {
    destroyResource: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getResource: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    updateResource: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    let { match, getResource, getProxyTypes } = props;
    let { id } = match.params;
    getResource(id);
    getProxyTypes();
  }

  componentDidUpdate(prevProps) {
    let wasUpdated = !this.props.model.update.isPending && prevProps.model.update.isPending && (!this.props.model.update.errors.length > 0);
    let { match, getResource, history, location } = this.props;
    let { id } = match.params;

    let { packageName, packageId } = prevProps.model;
    if (!prevProps.model.destroy.isResolved && this.props.model.destroy.isResolved) {
      history.replace(`/eholdings/packages/${packageId}?searchType=packages&q=${packageName}`,
        { eholdings: true, isDestroyed: true });
    }

    if (wasUpdated) {
      history.push({
        pathname: `/eholdings/resources/${this.props.model.id}`,
        search: location.search,
        state: { eholdings: true, isFreshlySaved: true }
      });
    }

    if (id !== prevProps.match.params.id) {
      getResource(id);
    }
  }

  toggleSelected = () => {
    let { model, updateResource, destroyResource } = this.props;
    model.isSelected = !model.isSelected;

    if (model.isSelected === false && model.package.isCustom) {
      destroyResource(model);
    } else if (model.isSelected === false) {
      // clear out any customizations before sending to server
      model.visibilityData.isHidden = false;
      model.customCoverages = [];
      model.coverageStatement = '';
      model.customEmbargoPeriod = {};
      model.identifiersList = [];
      model.identifiers = [];
      model.contributors = [];
      model.contributorsList = [];
      model.proxy = {};

      updateResource(model);
    } else {
      updateResource(model);
    }
  }

  render() {
    const { model, proxyTypes, history } = this.props;

    return (
      <TitleManager record={model.name}>
        <View
          model={model}
          proxyTypes={proxyTypes}
          toggleSelected={this.toggleSelected}
          editLink={{
            pathname: `/eholdings/resources/${model.id}/edit`,
            state: { eholdings: true }
          }}
          isFreshlySaved={
            history.action === 'PUSH' &&
            history.location.state &&
            history.location.state.isFreshlySaved
          }
        />
      </TitleManager>
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => {
    let resolver = createResolver(data);

    return {
      model: resolver.find('resources', match.params.id),
      proxyTypes: resolver.query('proxyTypes'),
      resolver
    };
  }, {
    getResource: id => Resource.find(id, { include: ['package', 'title'] }),
    getProxyTypes: () => ProxyType.query(),
    updateResource: model => Resource.save(model),
    destroyResource: model => Resource.destroy(model)
  }
)(ResourceShowRoute);
