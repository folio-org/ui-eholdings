import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteEditPage } from '@folio/stripes/smart-components';

import { formatNoteReferrerEntityData } from '../components/utilities';
import {
  entityTypeTranslationKeys,
  entityTypePluralizedTranslationKeys,
  APP_ICON_NAME,
  DOMAIN_NAME,
} from '../constants';

export default class NoteEditRoute extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
  };

  getReferredEntityData() {
    const {
      entityName: name,
      entityType: type,
      entityId: id,
    } = this.props.location.state;

    return {
      name,
      type,
      id,
    };
  }

  goToNoteView = () => {
    const {
      match,
      history,
      location,
    } = this.props;

    const { id } = match.params;
    const noteViewUrl = `/eholdings/notes/${id}`;

    history.replace({
      pathname: noteViewUrl,
      state: location.state,
    });
  }

  render() {
    const {
      location,
      match,
    } = this.props;

    const { id } = match.params;

    const referredEntityData = formatNoteReferrerEntityData(location.state);

    return (
      <NoteEditPage
        referredEntityData={referredEntityData}
        entityTypeTranslationKeys={entityTypeTranslationKeys}
        entityTypePluralizedTranslationKeys={entityTypePluralizedTranslationKeys}
        paneHeaderAppIcon={APP_ICON_NAME}
        domain={DOMAIN_NAME}
        navigateBack={this.goToNoteView}
        noteId={id}
      />
    );
  }
}
