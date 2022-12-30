import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Redirect } from 'react-router';

import { NoteCreatePage } from '@folio/stripes/smart-components';

import {
  entityTypeTranslationKeys,
  DOMAIN_NAME,
  APP_ICON_NAME,
} from '../constants';
import { formatNoteReferrerEntityData } from '../components/utilities';
import { withHistoryBack } from '../hooks';

class NoteCreateRoute extends Component {
  static propTypes = {
    goBack: PropTypes.func.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  };

  renderCreatePage() {
    const { goBack } = this.props;

    return (
      <NoteCreatePage
        referredEntityData={formatNoteReferrerEntityData(this.props.location.state)}
        entityTypeTranslationKeys={entityTypeTranslationKeys}
        paneHeaderAppIcon={APP_ICON_NAME}
        domain={DOMAIN_NAME}
        navigateBack={goBack} // OK REDIRECT
      />
    );
  }

  render() {
    const { location } = this.props;

    return location.state
      ? this.renderCreatePage()
      : <Redirect to="/eholdings" />;
  }
}

export default withHistoryBack(NoteCreateRoute);
