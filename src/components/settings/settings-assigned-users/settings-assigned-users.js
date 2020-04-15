import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import { Pluggable } from '@folio/stripes/core';
import {
  Pane,
  MultiColumnList,
  Row,
  Col,
  IconButton,
  Button,
  Modal,
  ModalFooter,
  Icon,
} from '@folio/stripes/components';

import { getFullName } from '../../utilities';

import css from './settings-assigned-users.css';

const pageTitle = <FormattedMessage id="ui-eholdings.settings.assignedUsers" />;

const propTypes = {
  alreadyAssignedMessageDisplayed: PropTypes.bool.isRequired,
  assignedUsers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    patronGroup: PropTypes.string.isRequired,
  })).isRequired,
  credentialsId: PropTypes.string.isRequired,
  hideAlreadyAssignedMessage: PropTypes.func.isRequired,
  knowledgeBaseName: PropTypes.string.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
  onSelectUser: PropTypes.func.isRequired,
  requestIsPending: PropTypes.bool.isRequired,
};

const SettingsAssignedUsers = ({
  assignedUsers,
  knowledgeBaseName,
  onDeleteUser,
  credentialsId,
  requestIsPending,
  onSelectUser,
  alreadyAssignedMessageDisplayed,
  hideAlreadyAssignedMessage,
}) => {
  const [
    userToBeUnassigned,
    setUserToBeUnassigned
  ] = useState(null);

  const [
    userToBeAssigned,
    setUserToBeAssigned
  ] = useState(null);

  const handleSelectUser = (user) => {
    setUserToBeAssigned(user);
    onSelectUser(user);
  };

  const header = (
    <Row
      between="xs"
      middle="xs"
      className={css.pageHeader}
    >
      <Col xs={4}>
        <span className={css.pageTitle}>
          {pageTitle}
        </span>
      </Col>
      <Col xs={2}>
        <Pluggable
          type="find-user"
          selectUser={handleSelectUser}
          searchLabel={<FormattedMessage id="ui-eholdings.settings.assignedUsers.assignmentModal.label" />}
        >
          <span>[find-user-plugin is not available]</span>
        </Pluggable>
      </Col>
    </Row>
  );

  const renderList = () => {
    return (
      <MultiColumnList
        contentData={assignedUsers}
        columnMapping={{
          name: <FormattedMessage id="ui-eholdings.settings.assignedUsers.list.name" />,
          patronGroup: <FormattedMessage id="ui-eholdings.settings.assignedUsers.list.patronGroup" />,
          id: '',
        }}
        columnWidths={{
          name: '50%',
          patronGroup: '41%',
          id: '9%'
        }}
        formatter={{
          id: user => (
            <div className={css.unassignCell}>
              <FormattedMessage id="ui-eholdings.settings.assignedUsers.list.unassignUser">
                {ariaLabel => (
                  <IconButton
                    icon="trash"
                    onClick={() => { setUserToBeUnassigned(user); }}
                    ariaLabel={ariaLabel}
                  />
                )}
              </FormattedMessage>
            </div>
          ),
        }}
      />
    );
  };

  const renderEmptyMessage = () => (
    <div className={css.emptyMessage}>
      <FormattedMessage id="ui-eholdings.settings.assignedUsers.list.emptyMessage" />
    </div>
  );

  const handleUnassignCancellation = () => {
    setUserToBeUnassigned(null);
  };

  const handleUnassignConfirmation = () => {
    setUserToBeUnassigned(null);
    onDeleteUser(userToBeUnassigned.id, credentialsId);
  };

  const renderLoadingIndicator = () => (
    <div className={css.loadingIndicator}>
      <Icon icon="spinner-ellipsis" />
    </div>
  );

  const renderUnassignConfirmationModal = () => {
    return (
      <Modal
        size="small"
        open
        label={<FormattedMessage id="ui-eholdings.settings.assignedUsers.confirmationModal.title" />}
        footer={(
          <ModalFooter>
            <Button
              buttonStyle="primary"
              onClick={handleUnassignConfirmation}
              disabled={requestIsPending}
            >
              <FormattedMessage id="ui-eholdings.settings.assignedUsers.confirmationModal.confirmButton" />
            </Button>
            <Button
              onClick={handleUnassignCancellation}
              disabled={requestIsPending}
            >
              <FormattedMessage id="ui-eholdings.settings.assignedUsers.confirmationModal.cancelButton" />
            </Button>
          </ModalFooter>
        )}
      >
        <SafeHTMLMessage
          id="ui-eholdings.settings.assignedUsers.confirmationModal.prompt"
          values={{
            userName: userToBeUnassigned.name,
            knowledgeBaseName,
          }}
        />
      </Modal>
    );
  };

  const renderAlreadyAssignedMessage = () => (
    <Modal
      size="small"
      open
      label={<FormattedMessage id="ui-eholdings.settings.assignedUsers.alreadyAssignedModal.title" />}
      footer={(
        <ModalFooter>
          <Button
            buttonStyle="primary"
            onClick={hideAlreadyAssignedMessage}
          >
            <FormattedMessage id="ui-eholdings.settings.assignedUsers.confirmationModal.cancelButton" />
          </Button>
        </ModalFooter>
      )}
    >
      <SafeHTMLMessage
        id="ui-eholdings.settings.assignedUsers.alreadyAssignedModal.message"
        values={{ userName: getFullName(userToBeAssigned.personal) }}
      />
    </Modal>
  );

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={pageTitle}
    >
      {header}
      {requestIsPending ?
        renderLoadingIndicator()
        : assignedUsers.length
          ? renderList()
          : renderEmptyMessage()
      }
      {userToBeUnassigned && renderUnassignConfirmationModal()}
      {alreadyAssignedMessageDisplayed && renderAlreadyAssignedMessage()}
    </Pane>
  );
};

SettingsAssignedUsers.propTypes = propTypes;

export default SettingsAssignedUsers;
