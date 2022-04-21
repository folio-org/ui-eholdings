import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import isEqual from 'lodash/isEqual';
import { FormattedMessage } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';

import View from '../../components/title/edit';
import {
  expandIdentifiers,
  mergeIdentifiers,
} from '../utils';

class TitleEditRoute extends Component {
  static propTypes = {
    getTitle: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    removeUpdateRequests: PropTypes.func.isRequired,
    updateRequest: PropTypes.object.isRequired,
    updateTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { match, getTitle } = props;
    const { titleId } = match.params;

    getTitle(titleId);
  }

  componentDidUpdate(prevProps) {
    const {
      match,
      getTitle,
      history,
      location,
      model,
      updateRequest,
    } = this.props;
    const { titleId } = match.params;

    // prevent being able to visit an edit form for uneditable managed titles
    if (model.isLoaded && !model.isTitleCustom) {
      history.replace({
        pathname: `/eholdings/titles/${model.id}`,
        search: location.search,
      }, { eholdings: true });
    }

    if (!prevProps.updateRequest.isResolved && updateRequest.isResolved) {
      history.replace({
        pathname: `/eholdings/titles/${model.id}`,
        state: {
          eholdings: true,
          isFreshlySaved: true,
        },
      });
    }

    if (titleId !== prevProps.match.params.titleId) {
      getTitle(titleId);
    }

    const wasPending = prevProps.model.update.isPending && !model.update.isPending;
    const needsUpdate = !isEqual(prevProps.model, model);
    const isRejected = model.update.isRejected;

    if (wasPending && needsUpdate && !isRejected) {
      history.replace({
        pathname: `/eholdings/titles/${model.id}`,
        search: location.search,
        state: {
          eholdings: true,
          isFreshlySaved: true,
        },
      });
    }
  }

  componentWillUnmount() {
    this.props.removeUpdateRequests();
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

    history.replace(viewRouteState);
  }

  titleEditSubmitted = (values) => {
    const {
      model,
      updateTitle,
    } = this.props;

    const newValues = {
      ...values,
      identifiers: expandIdentifiers(values.identifiers),
    };

    updateTitle(Object.assign(model, newValues));
  }

  renderView() {
    const {
      model,
      updateRequest,
    } = this.props;

    return (
      <FormattedMessage
        id="ui-eholdings.label.editLink"
        values={{ name: model.name }}
      >
        {([pageTitle]) => (
          <TitleManager record={pageTitle}>
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
                identifiers: mergeIdentifiers(model.identifiers),
              }}
            />
          </TitleManager>
        )}
      </FormattedMessage>
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
    const { model } = this.props;

    return model.isLoaded
      ? this.renderView()
      : this.indicateModelIsNotLoaded();
  }
}

export default TitleEditRoute;
