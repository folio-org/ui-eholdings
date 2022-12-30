import { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import { NoteEditPage } from '@folio/stripes/smart-components';

import { formatNoteReferrerEntityData } from '../components/utilities';
import {
  entityTypeTranslationKeys,
  entityTypePluralizedTranslationKeys,
  APP_ICON_NAME,
  DOMAIN_NAME,
} from '../constants';
import { withHistoryBack } from '../hooks';

class NoteEditRoute extends Component {
  static propTypes = {
    goBack: PropTypes.func.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  goToNoteView = () => {
    this.props.goBack(); // OK REDIRECT
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

export default withHistoryBack(NoteEditRoute);
