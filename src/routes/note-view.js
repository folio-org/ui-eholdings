import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteViewPage } from '@folio/stripes/smart-components';

import { formatNoteReferrerEntityData } from '../components/utilities';
import {
  entityTypeTranslationKeys,
  entityTypePluralizedTranslationKeys,
  APP_ICON_NAME,
} from '../constants';
import { withHistoryBack } from '../hooks';

class NoteViewRoute extends Component {
  static propTypes = {
    goBack: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        noteId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  onEdit = () => {
    const {
      history,
      location,
      match,
    } = this.props;

    history.push({ // OK REDIRECT
      pathname: `/eholdings/notes/${match.params.noteId}/edit/`,
      state: location.state,
    });
  };

  render() {
    const {
      match,
      location,
      goBack,
    } = this.props;

    const { noteId } = match.params;
    const referredEntityData = formatNoteReferrerEntityData(location.state);

    return (
      <NoteViewPage
        entityTypeTranslationKeys={entityTypeTranslationKeys}
        entityTypePluralizedTranslationKeys={entityTypePluralizedTranslationKeys}
        navigateBack={goBack}
        onEdit={this.onEdit}
        paneHeaderAppIcon={APP_ICON_NAME}
        referredEntityData={referredEntityData}
        noteId={noteId}
      />
    );
  }
}

export default withHistoryBack(NoteViewRoute);
