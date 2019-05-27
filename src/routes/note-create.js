import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Redirect } from 'react-router';

import { NoteCreatePage } from '@folio/stripes/smart-components';

import {
  entityTypesTranslationKeys,
  DOMAIN_NAME,
  APP_ICON_NAME,
} from '../constants';

export default class NoteCreateRoute extends Component {
  static propTypes = {
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    location: ReactRouterPropTypes.location.isRequired,
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

  render() {
    const {
      history,
      location,
    } = this.props;

    return location.state
      ? (
        <NoteCreatePage
          referredEntityData={this.getReferredEntityData()}
          entityTypesTranslationKeys={entityTypesTranslationKeys}
          paneHeaderAppIcon={APP_ICON_NAME}
          domain={DOMAIN_NAME}
          navigateBack={history.goBack}
        />
      )
      : <Redirect to="/eholdings" />;
  }
}
