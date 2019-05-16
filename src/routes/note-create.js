import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteCreatePage } from '@folio/stripes-smart-components';

import { entityTypesTranslationKeys } from '../constants';

export default class NoteCreateRoute extends Component {
  static propTypes = {
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  };

  referredEntityData = this.getReferredEntityData();

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
    const { goBack } = this.props.history;

    return (
      <NoteCreatePage
        referredEntityData={this.referredEntityData}
        entityTypesTranslationKeys={entityTypesTranslationKeys}
        paneHeaderAppIcon="eholdings"
        domain="eholdings"
        navigateBack={goBack}
      />
    );
  }
}
