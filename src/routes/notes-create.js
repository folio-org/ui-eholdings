import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { NotesForm } from '@folio/stripes-smart-components';
import PaneSet from '../components/paneset';
import { Pane } from '../components/paneset';


class NotesCreateRoute extends Component {
  static propTypes = {
    noteTypes: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.object.isRequired,
  };

  // TODO history back/forward

  render() {
    return (
      <FormattedMessage id="ui-eholdings.notes.newNote">
        {pageTitle => (
          <TitleManager record={pageTitle}>
            <PaneSet>
              <Pane flexGrow="1">
                <NotesForm
                  formId={321}
                  onSubmit={() => {}}
                  noteId={123}
                  noteTypes={[]}
                  noteTitle={''}
                  noteDetails={''}
                  assignedTo={{
                    entityType:'',
                    entityName:'',
                  }}
                />
              </Pane>
            </PaneSet>
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
        label: 'type 1',
        value: '1',
      }
    ],
  }), {
    onSubmit: () => { },
    onCancel: () => { },
  }
)(NotesCreateRoute);
