import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteEditPage } from '@folio/stripes/smart-components';

import {
  entityTypeTranslationKeys,
  entityTypePluralizedTranslationKeys,
} from '../constants';

export default class NoteEditRoute extends Component {
  static propTypes = {
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
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
    } = this.props;

    const { id } = match.params;
    const noteViewUrl = `/eholdings/notes/${id}`;

    history.replace(noteViewUrl);
  }

  render() {
    const {
      location,
      match,
    } = this.props;

    const { id } = match.params;

    const referredEntityData = location.state && this.getReferredEntityData();

    return (
      <NoteEditPage
        referredEntityData={referredEntityData}
        entityTypeTranslationKeys={entityTypeTranslationKeys}
        entityTypePluralizedTranslationKeys={entityTypePluralizedTranslationKeys}
        paneHeaderAppIcon="eholdings"
        domain="eholdings"
        navigateBack={this.goToNoteView}
        noteId={id}
      />
    );
  }
}
