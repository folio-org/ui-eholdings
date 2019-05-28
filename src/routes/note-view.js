import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteViewPage } from '@folio/stripes/smart-components';

import {
  APP_ICON_NAME,
} from '../constants';

const entityTypeTranslationKeys = {
  provider: 'ui-eholdings.notes.entityType.provider',
  package: 'ui-eholdings.notes.entityType.package',
  title: 'ui-eholdings.notes.entityType.title',
  resource: 'ui-eholdings.notes.entityType.resource',
};

const entityTypePluralizedTranslationKeys = {
  provider: 'ui-eholdings.notes.entityType.provider.pluralized',
  package: 'ui-eholdings.notes.entityType.package.pluralized',
  title: 'ui-eholdings.notes.entityType.title.pluralized',
  resource: 'ui-eholdings.notes.entityType.resource.pluralized',
};

class NoteViewRoute extends Component {
  static propTypes = {
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        noteId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  getReferredEntityData() {
    if (this.props.location.state) {
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

    return false;
  }

  onEdit = (noteId) => {
    const {
      history,
      location,
    } = this.props;

    history.push({
      pathname: `/eholdings/notes/${noteId}/edit/`,
      state: location.state,
    });
  }

  render() {
    const {
      history,
      match,
    } = this.props;

    const { noteId } = match.params;

    return (
      <NoteViewPage
        entityTypeTranslationKeys={entityTypeTranslationKeys}
        entityTypePluralizedTranslationKeys={entityTypePluralizedTranslationKeys}
        navigateBack={history.goBack}
        onEdit={this.onEdit}
        paneHeaderAppIcon={APP_ICON_NAME}
        referredEntityData={this.getReferredEntityData()}
        noteId={noteId}
      />
    );
  }
}

export default NoteViewRoute;
