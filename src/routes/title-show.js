import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import queryString from 'qs';

import { TitleManager } from '@folio/stripes/core';

import {
  costPerUse as costPerUseShape,
  listTypes,
} from '../constants';
import {
  getCostPerUse as getCostPerUseAction,
} from '../redux/actions';
import { selectPropFromData } from '../redux/selectors';
import { createResolver } from '../redux';
import Title from '../redux/title';
import Package from '../redux/package';
import Resource from '../redux/resource';
import View from '../components/title/show';

class TitleShowRoute extends Component {
  static propTypes = {
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
    const { match, createRequest } = prevProps;
    const { titleId } = this.props.match.params;

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
    const { match, createResource } = this.props;
    const { titleId } = match.params;

    createResource({
      url: customUrl,
      packageId,
      titleId
    });
  };

  fetchTitleCostPerUse = (filterData) => {
    const {
      getCostPerUse,
      model: { id },
    } = this.props;

    getCostPerUse(listTypes.TITLES, id, filterData);
  }

  getSearchType = () => {
    const { searchType } = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true });
    return searchType;
  }

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
  }

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

export default connect(
  (store, { match }) => {
    const {
      eholdings: { data },
    } = store;
    const resolver = createResolver(data);

    return {
      model: resolver.find('titles', match.params.titleId),
      createRequest: resolver.getRequest('create', { type: 'resources' }),
      customPackages: resolver.query('packages', {
        filter: { custom: true },
        count: 100
      }),
      costPerUse: selectPropFromData(store, 'costPerUse'),
    };
  }, {
    getTitle: id => Title.find(id, { include: 'resources' }),
    createResource: attrs => Resource.create(attrs),
    getCustomPackages: () => Package.query({
      filter: { custom: true },
      count: 100
    }),
    getCostPerUse: getCostPerUseAction,
  }
)(TitleShowRoute);
