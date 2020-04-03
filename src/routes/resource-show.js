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
import { getAccessTypes as getAccessTypesAction } from '../redux/actions';
import { selectPropFromData } from '../redux/selectors';

import { accessTypesReduxStateShape } from '../constants';

class ResourceShowRoute extends Component {
  static propTypes = {
    accessTypes: accessTypesReduxStateShape.isRequired,
    destroyResource: PropTypes.func.isRequired,
    getAccessTypes: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getResource: PropTypes.func.isRequired,
    getTags: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    removeUpdateRequests: PropTypes.func.isRequired,
    tagsModel: PropTypes.object.isRequired,
    updateFolioTags: PropTypes.func.isRequired,
    updateResource: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const {
      match,
      getResource,
      getAccessTypes,
      getProxyTypes,
      getTags,
    } = props;
    const { id } = match.params;
    getResource(id);
    getProxyTypes();
    getAccessTypes();
    getTags();
  }

  componentDidUpdate(prevProps) {
    const wasUpdated = !this.props.model.update.isPending && prevProps.model.update.isPending && (!this.props.model.update.errors.length > 0);

    const { match, getResource, history, location, removeUpdateRequests } = this.props;
    const { id } = match.params;

    const isRejected = this.props.model.update.isRejected;
    const isSelectedChanged = wasUpdated && !isRejected && prevProps.model.isSelected !== this.props.model.isSelected;

    const { packageName, packageId } = prevProps.model;
    if (!prevProps.model.destroy.isResolved && this.props.model.destroy.isResolved) {
      history.replace(`/eholdings/packages/${packageId}?searchType=packages&q=${packageName}`,
        { eholdings: true, isDestroyed: true });
    }

    if (isSelectedChanged) {
      removeUpdateRequests();
    }

    if (wasUpdated) {
      history.replace({
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
      model.userDefinedField1 = '';
      model.userDefinedField2 = '';
      model.userDefinedField3 = '';
      model.userDefinedField4 = '';
      model.userDefinedField5 = '';

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
      accessTypes,
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
          accessStatusTypes={accessTypes}
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
      accessTypes: selectPropFromData(store, 'accessStatusTypes'),
    };
  }, {
    getResource: id => Resource.find(id, { include: ['package', 'title', 'accessType'] }),
    getProxyTypes: () => ProxyType.query(),
    updateResource: model => Resource.save(model),
    updateFolioTags: model => Tag.create(model),
    getTags: () => Tag.query(),
    destroyResource: model => Resource.destroy(model),
    getAccessTypes: getAccessTypesAction,
    removeUpdateRequests: () => Resource.removeRequests('update'),
  }
)(ResourceShowRoute);
