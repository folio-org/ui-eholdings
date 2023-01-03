import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { TitleManager } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';

import View from '../../components/resource/resource-show';

import {
  accessTypesReduxStateShape,
  costPerUse as costPerUseShape,
  listTypes,
} from '../../constants';

class ResourceShowRoute extends Component {
  static propTypes = {
    accessTypes: accessTypesReduxStateShape.isRequired,
    clearCostPerUseData: PropTypes.func.isRequired,
    costPerUse: costPerUseShape.CostPerUseReduxStateShape.isRequired,
    destroyResource: PropTypes.func.isRequired,
    getAccessTypes: PropTypes.func.isRequired,
    getCostPerUse: PropTypes.func.isRequired,
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
    const {
      model: next,
      match,
      getResource,
      history,
      location,
      removeUpdateRequests,
    } = this.props;

    const {
      model: old,
      match: oldMatch,
    } = prevProps;

    const { id } = match.params;

    const wasUpdated = !next.update.isPending
      && old.update.isPending
      && (!next.update.errors.length > 0);

    const isRejected = next.update.isRejected;
    const isSelectedChanged = wasUpdated && !isRejected && old.isSelected !== next.isSelected;

    const {
      packageName,
      packageId,
    } = old;

    if (!old.destroy.isResolved && next.destroy.isResolved) {
      history.replace(
        `/eholdings/packages/${packageId}?searchType=packages&q=${packageName}`,
        {
          eholdings: true,
          isDestroyed: true,
        },
      );
    }

    if (isSelectedChanged) {
      removeUpdateRequests();
    }

    if (wasUpdated) {
      history.replace({
        pathname: `/eholdings/resources/${next.id}`,
        search: location.search,
        state: {
          eholdings: true,
          isFreshlySaved: true,
        },
      });
    }

    if (id !== oldMatch.params.id) {
      getResource(id);
    }
  }

  componentWillUnmount() {
    this.props.clearCostPerUseData();
  }

  toggleSelected = () => {
    const {
      model,
      updateResource,
      destroyResource,
    } = this.props;

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

  fetchResourceCostPerUse = (filterData) => {
    const {
      getCostPerUse,
      model: { id },
    } = this.props;

    getCostPerUse(listTypes.RESOURCES, id, filterData);
  }

  render() {
    const {
      model,
      proxyTypes,
      accessTypes,
      history,
      tagsModel,
      updateFolioTags,
      costPerUse,
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
          fetchResourceCostPerUse={this.fetchResourceCostPerUse}
          costPerUse={costPerUse}
          isFreshlySaved={
            history.location.state &&
            history.location.state.isFreshlySaved
          }
        />
      </TitleManager>
    );
  }
}

export default ResourceShowRoute;
