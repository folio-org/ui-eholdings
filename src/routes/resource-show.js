import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { TitleManager } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';

import { createResolver } from '../redux';
import Resource from '../redux/resource';
import View from '../components/resource/resource-show';
import { ProxyType } from '../redux/application';
import Tag from '../redux/tag';

class ResourceShowRoute extends Component {
  static propTypes = {
    destroyResource: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getResource: PropTypes.func.isRequired,
    getTags: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    tagsModel: PropTypes.object.isRequired,
    updateFolioTags: PropTypes.func.isRequired,
    updateResource: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const {
      match,
      getResource,
      getProxyTypes,
      getTags,
    } = props;
    const { id } = match.params;
    getResource(id);
    getProxyTypes();
    getTags();
  }

  componentDidUpdate(prevProps) {
    const wasUpdated = !this.props.model.update.isPending && prevProps.model.update.isPending && (!this.props.model.update.errors.length > 0);
    const { match, getResource, history, location } = this.props;
    const { id } = match.params;

    const { packageName, packageId } = prevProps.model;
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
    const { model, updateResource, destroyResource } = this.props;
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

  handleEdit = () => {
    const {
      model,
      history,
    } = this.props;

    const editRouteState = {
      pathname: `/eholdings/resources/${model.id}/edit`,
      state: { eholdings: true },
    };

    history.replace(editRouteState);
  }

  render() {
    const {
      model,
      proxyTypes,
      history,
      tagsModel,
      updateFolioTags,
    } = this.props;

    if (model.isLoading) {
      return <Icon icon='spinner-ellipsis' />;
    }

    return (
      <TitleManager record={model.name}>
        <View
          model={model}
          tagsModel={tagsModel}
          updateFolioTags={updateFolioTags}
          proxyTypes={proxyTypes}
          toggleSelected={this.toggleSelected}
          onEdit={this.handleEdit}
          isFreshlySaved={
            history.location.state &&
            history.location.state.isFreshlySaved
          }
        />
      </TitleManager>
    );
  }
}

export default connect(
  (store, { match }) => {
    const {
      eholdings: { data },
    } = store;

    const resolver = createResolver(data);

    return {
      model: resolver.find('resources', match.params.id),
      tagsModel: resolver.query('tags'),
      proxyTypes: resolver.query('proxyTypes'),
      resolver,
    };
  }, {
    getResource: id => Resource.find(id, { include: ['package', 'title'] }),
    getProxyTypes: () => ProxyType.query(),
    updateResource: model => Resource.save(model),
    updateFolioTags: model => Tag.create(model),
    getTags: () => Tag.query(),
    destroyResource: model => Resource.destroy(model),
  }
)(ResourceShowRoute);
