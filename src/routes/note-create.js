import React, { Component } from 'react';
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

export default class NoteCreateRoute extends Component {
  static propTypes = {
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  };

  renderCreatePage() {
    const { history } = this.props;

    return (
      <NoteCreatePage
        referredEntityData={formatNoteReferrerEntityData(this.props.location.state)}
        entityTypeTranslationKeys={entityTypeTranslationKeys}
        paneHeaderAppIcon={APP_ICON_NAME}
        domain={DOMAIN_NAME}
        navigateBack={history.goBack}
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
