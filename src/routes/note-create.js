import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { NoteForm } from '@folio/stripes-smart-components';

const entityTypeTranslationKeyMap = {
  provider: 'ui-eholdings.notes.entityType.provider',
  package: 'ui-eholdings.notes.entityType.package',
  title: 'ui-eholdings.notes.entityType.title',
};

class NoteCreateRoute extends Component {
  static propTypes = {
    noteTypes: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  render() {
    const {
      noteTypes,
      onSubmit,
      onCancel,
    } = this.props;

    const referredRecord = {
      type: 'provider',
      name: 'EBSCO',
    };

    return (
      <FormattedMessage id="stripes-smart-components.notes.newNote">
        {pageTitle => (
          <TitleManager record={pageTitle}>
            <NoteForm
              onSubmit={onSubmit}
              onCancel={onCancel}
              noteTypes={noteTypes}
              referredRecord={referredRecord}
              entityTypeTranslationKeyMap={entityTypeTranslationKeyMap}
              paneHeaderAppIcon="eholdings"
            />
          </TitleManager>
        )}
      </FormattedMessage>
    );
  }
}

export default connect(
  () => ({
    noteTypes: [
      {
        label: 'type 1',
        value: '1',
      },
      {
        label: 'type 2',
        value: '2',
      }
    ],
  }), {
    onSubmit: (values) => {
      console.log('submit', values);
      return { type: 'noteCreate', payload: { noteData: values } };
    },
    onCancel: () => {
      console.log('cancel');
      return { type: 'cancelNoteCreate' };
    },
  }
)(NoteCreateRoute);
