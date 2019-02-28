import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import queryString from 'qs';

import { TitleManager } from '@folio/stripes/core';
import { Icon } from '@folio/stripes-components';

import { createResolver } from '../redux';
import Title from '../redux/title';

import View from '../components/title/edit';

class TitleEditRoute extends Component {
  static propTypes = {
    getTitle: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    updateRequest: PropTypes.object,
    updateTitle: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    let { match, getTitle } = props;
    let { titleId } = match.params;
    getTitle(titleId);
  }

  componentDidUpdate(prevProps) {
    let { match, getTitle, history, location, model } = this.props;
    let { titleId } = match.params;

    // prevent being able to visit an edit form for uneditable managed titles
    if (model.isLoaded && !model.isTitleCustom) {
      history.replace({
        pathname: `/eholdings/titles/${model.id}`,
        search: location.search,
      }, { eholdings: true });
    }

    if (!prevProps.updateRequest.isResolved && this.props.updateRequest.isResolved) {
      this.props.history.push(
        `/eholdings/titles/${this.props.model.id}`,
        { eholdings: true, isFreshlySaved: true }
      );
    }

    if (titleId !== prevProps.match.params.titleId) {
      getTitle(titleId);
    }

    let wasPending = prevProps.model.update.isPending && !model.update.isPending;
    let needsUpdate = !isEqual(prevProps.model, model);
    let isRejected = model.update.isRejected;

    if (wasPending && needsUpdate && !isRejected) {
      history.push({
        pathname: `/eholdings/titles/${model.id}`,
        search: location.search,
        state: { eholdings: true, isFreshlySaved: true }
      });
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
        mergedTypeIndex = this.flattenedIdentifiers.findIndex(row => row.type === type && row.subtype === subtype);
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

  getSearchType = () => {
    const { searchType } = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true });
    return searchType;
  }

  handleFullView = () => {
    const {
      history,
      model,
    } = this.props;

    const fullViewRouteState = {
      pathname: `/eholdings/titles/${model.id}/edit`,
      state: { eholdings: true },
    };

    history.push(fullViewRouteState);
  }

  handleCancel = () => {
    const {
      history,
      model,
      location,
    } = this.props;

    const viewRouteState = {
      pathname: `/eholdings/titles/${model.id}`,
      search: location.search,
      state: { eholdings: true },
    };

    if (this.getSearchType()) {
      history.push(viewRouteState);
    }

    history.replace(viewRouteState);
  }

  titleEditSubmitted = (values) => {
    const {
      model,
      updateTitle,
    } = this.props;

    const excludedAttrs = {
      subjects: null,
      isTitleCustom: null,
    };

    const newValues = {
      ...values,
      identifiers: this.expandIdentifiers(values.identifiers),
      ...excludedAttrs,
    };

    updateTitle(Object.assign(model, newValues));
  }

  renderView() {
    const {
      model,
      updateRequest,
    } = this.props;

    return (
      <TitleManager record={`Edit ${this.props.model.name}`}>
        <View
          model={model}
          onSubmit={this.titleEditSubmitted}
          onCancel={this.handleCancel}
          updateRequest={updateRequest}
          initialValues={{
            name: model.name,
            edition: model.edition,
            isPeerReviewed: model.isPeerReviewed,
            publicationType: model.publicationType,
            publisherName: model.publisherName,
            description: model.description,
            contributors: model.contributors,
            identifiers: this.mergeIdentifiers(model.identifiers)
          }}
          onFullView={this.getSearchType() && this.handleFullView}
        />
      </TitleManager>
    );
  }

  indicateModelIsNotLoaded() {
    const { model } = this.props;

    return model.request.isRejected
      ? this.renderRequestErrorMessage()
      : (
        <Icon
          icon="spinner-ellipsis"
          iconSize="small"
        />
      );
  }

  renderRequestErrorMessage() {
    const { model } = this.props;

    return (
      <p data-test-eholdings-title-edit-error>
        {model.request.errors[0].title}
      </p>
    );
  }

  render() {
    let { model } = this.props;

    return model.isLoaded
      ? this.renderView()
      : this.indicateModelIsNotLoaded();
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('titles', match.params.titleId),
    updateRequest: createResolver(data).getRequest('update', { type: 'titles' })
  }), {
    getTitle: id => Title.find(id, { include: 'resources' }),
    updateTitle: model => Title.save(model)
  }
)(TitleEditRoute);
