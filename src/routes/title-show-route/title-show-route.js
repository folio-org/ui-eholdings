import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { TitleManager } from '@folio/stripes/core';

import {
  costPerUse as costPerUseShape,
  listTypes,
} from '../../constants';
import View from '../../components/title/show';

class TitleShowRoute extends Component {
  static propTypes = {
    clearCostPerUseData: PropTypes.func.isRequired,
    costPerUse: costPerUseShape.CostPerUseReduxStateShape.isRequired,
    createRequest: PropTypes.object.isRequired,
    createResource: PropTypes.func.isRequired,
    customPackages: PropTypes.object.isRequired,
    getCostPerUse: PropTypes.func.isRequired,
    getCustomPackages: PropTypes.func.isRequired,
    getTitle: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const {
      match,
      getTitle,
      getCustomPackages,
    } = this.props;

    const { titleId } = match.params;

    getTitle(titleId);
    getCustomPackages();
  }

  componentDidUpdate(prevProps) {
    const {
      match,
      createRequest,
    } = prevProps;
    const { titleId } = this.props.match.params;

    if (match.params.titleId !== titleId) {
      this.props.getTitle(titleId);
    }

    if (!createRequest.isResolved && this.props.createRequest.isResolved) {
      this.props.history.push(
        `/eholdings/resources/${this.props.createRequest.records[0]}`,
        {
          eholdings: true,
          isNewRecord: true,
        }
      );
    }
  }

  componentWillUnmount() {
    this.props.clearCostPerUseData();
  }

  createResource = ({
    packageId,
    customUrl,
  }) => {
    const {
      match,
      createResource,
    } = this.props;
    const { titleId } = match.params;

    createResource({
      url: customUrl,
      packageId,
      titleId,
    });
  };

  fetchTitleCostPerUse = (filterData) => {
    const {
      getCostPerUse,
      model: { id },
    } = this.props;

    getCostPerUse(listTypes.TITLES, id, filterData);
  };

  handleEdit = () => {
    const {
      history,
      model,
      location,
    } = this.props;

    const editRouteState = {
      pathname: `/eholdings/titles/${model.id}/edit`,
      search: location.search,
      state: { eholdings: true },
    };

    history.replace(editRouteState);
  };

  onPackageFilter = (searchParam) => {
    this.props.getCustomPackages(searchParam);
  };

  render() {
    const {
      model,
      customPackages,
      createRequest,
      history,
      costPerUse,
    } = this.props;

    return (
      <TitleManager record={model.name}>
        <View
          request={createRequest}
          model={model}
          customPackages={customPackages}
          addCustomPackage={this.createResource}
          onPackageFilter={this.onPackageFilter}
          onEdit={this.handleEdit}
          fetchTitleCostPerUse={this.fetchTitleCostPerUse}
          costPerUse={costPerUse}
          isFreshlySaved={
            history.action === 'REPLACE' &&
            history.location.state &&
            history.location.state.isFreshlySaved
          }
          isNewRecord={
            history.action === 'REPLACE' &&
            history.location.state &&
            history.location.state.isNewRecord
          }
        />
      </TitleManager>
    );
  }
}

export default TitleShowRoute;
