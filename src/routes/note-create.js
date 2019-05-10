import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import queryString from 'qs';

import { TitleManager } from '@folio/stripes/core';
import { NoteForm } from '@folio/stripes-smart-components';

const entityTypesPaths = {
  provider: 'providers',
  package: 'packages',
  resource: 'resources',
};

const entityTypeTranslationKeyMap = {
  provider: 'ui-eholdings.notes.entityType.provider',
  package: 'ui-eholdings.notes.entityType.package',
  title: 'ui-eholdings.notes.entityType.title',
};

const noteTypes = [
  { value: '1', label: 'type 1' },
  { value: '2', label: 'type 2' },
  { value: '3', label: 'type 3' },
];

export default class NoteCreateRoute extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  };

  constructor(props) {
    super(props);

    this.referredEntityData = this.retreiveReferredEntityDataFromQueryParams();
  }

  onCancel = () => {
    this.goToPreviousLocation();
  }

  onNoteSaved = () => {
    this.goToPreviousLocation();
  }


  goToPreviousLocation = () => {
    const {
      type,
      id,
    } = this.referredEntityData;

    const entityTypePath = entityTypesPaths[type];

    this.props.history.push({
      pathname: `/eholdings/${entityTypePath}/${id}`
    });
  }

  retreiveReferredEntityDataFromQueryParams() {
    const parsedParams = queryString.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });

    return {
      type: parsedParams.referredType,
      name: parsedParams.referredName,
      id: parsedParams.referredId,
    };
  }

  render() {
    const {
      name,
      type,
    } = this.referredEntityData;

    // TODO: find a better name
    const referredEntityData = {
      name,
      type,
    };

    return (
      <FormattedMessage id="stripes-smart-components.notes.newNote">
        {pageTitle => (
          <TitleManager record={pageTitle}>
            <NoteForm
              onSubmit={this.onNoteSaved}
              onCancel={this.onCancel}
              noteTypes={noteTypes}
              referredEntityData={referredEntityData}
              entityTypeTranslationKeyMap={entityTypeTranslationKeyMap}
              paneHeaderAppIcon="eholdings"
              submitSucceeded={false}
            />
          </TitleManager>
        )}
      </FormattedMessage>
    );
  }
}
