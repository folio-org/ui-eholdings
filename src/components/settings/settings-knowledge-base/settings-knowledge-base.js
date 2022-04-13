import {
  useEffect,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { useHistory } from 'react-router';

import { IfPermission } from '@folio/stripes/core';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import {
  Icon,
  TextField,
  Select,
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import SettingsForm from '../settings-form';
import NavigationModal from '../../navigation-modal';
import ShowHidePasswordField from '../../show-hide-password-field';
import {
  apiEndpointsOptions,
  KbCredentials,
  KB_NAME_VALUE_MAX_LENGTH,
} from '../../../constants';

const focusOnErrors = createFocusDecorator();

const propTypes = {
  config: KbCredentials.CredentialShape,
  currentKBName: PropTypes.string.isRequired,
  isCreateMode: PropTypes.bool,
  kbCredentials: KbCredentials.KbCredentialsReduxStateShape,
  kbId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const defaultProps = {
  isCreateMode: false,
};

const SettingsKnowledgeBase = ({
  config,
  currentKBName,
  isCreateMode,
  kbCredentials,
  kbId,
  onDelete,
  onSubmit,
}) => {
  const intl = useIntl();
  const history = useHistory();

  const [toasts, setToasts] = useState([]);
  const [deleteConfirmationModalDisplayed, setDeleteConfirmationModalDisplayed] = useState(false);

  useEffect(() => {
    if (kbCredentials.hasUpdated) {
      history.push({
        pathname: `/settings/eholdings/knowledge-base/${config.id}`,
        state: {
          eholdings: true,
          isFreshlySaved: true,
        },
      });

      setToasts([
        ...toasts,
        {
          id: `settings-kb-${config.id}`,
          message: <FormattedMessage id="ui-eholdings.settings.kb.updated" />,
          type: 'success',
        },
      ]);
    }
  }, [kbCredentials.hasUpdated]);

  useEffect(() => {
    if (kbCredentials.hasSaved) {
      history.push({
        pathname: `/settings/eholdings/knowledge-base/${config.id}`,
        state: {
          eholdings: true,
          isFreshlySaved: true,
        },
      });

      setToasts([
        ...toasts,
        {
          id: `settings-kb-${config.id}-${Date.now()}`,
          message: (
            <FormattedMessage
              id="ui-eholdings.settings.kb.saved"
              values={{ name: config.attributes.name }}
            />
          ),
          type: 'success',
        },
      ]);
    }
  }, [kbCredentials.hasSaved]);

  const prevErrors = useRef(kbCredentials.errors).current;

  useEffect(() => {
    if (prevErrors !== kbCredentials.errors) {
      setToasts([
        ...toasts,
        ...kbCredentials.errors.map(error => ({
          id: `settings-kb-${config.id}-${Date.now()}`,
          message: error.title,
          type: 'error',
        })),
      ]);
    }

    prevErrors.current = kbCredentials.errors;
  }, [kbCredentials.errors]);

  if (!config) {
    return null;
  }

  const validateNameField = (value) => {
    if (!value) {
      return <FormattedMessage id="ui-eholdings.validate.errors.settings.kb.name" />;
    }

    if (value.length > KB_NAME_VALUE_MAX_LENGTH) {
      return <FormattedMessage id="ui-eholdings.validate.errors.settings.kb.name.length" />;
    }

    return null;
  };

  const validateCustomerId = (value) => (
    value ? null : <FormattedMessage id="ui-eholdings.validate.errors.settings.customerId" />
  );

  const validateApiKey = (value) => (
    value ? null : <FormattedMessage id="ui-eholdings.validate.errors.settings.apiKey" />
  );

  const getKbCredentialsName = () => {
    const defaultName = intl.formatMessage({ id: 'ui-eholdings.settings.kb' });

    const kbCredentialsNames = kbCredentials.items.map(({ attributes: { name } }) => name);
    const defaultNameIsPresent = kbCredentialsNames.some(name => name === defaultName);

    if (!defaultNameIsPresent) {
      return defaultName;
    } else {
      const reg = new RegExp(`${defaultName} \\(\\d*\\)`);
      const filteredNames = kbCredentialsNames.reduce((acc, name) => {
        if (name.match(reg)) {
          const red1 = new RegExp(`${defaultName} \\(`);
          const numberInName = parseInt(name.replace(red1, ''), 10);

          return [...acc, numberInName];
        }

        return acc;
      }, []);

      let number = 1;

      while (filteredNames.indexOf(number) !== -1) {
        number++;
      }

      return intl.formatMessage(
        { id: 'ui-eholdings.settings.kb.defaultName' },
        { number }
      );
    }
  };

  const getInitialValues = () => {
    const initialValues = {
      url: 'https://sandbox.ebsco.io',
      name: isCreateMode ? getKbCredentialsName() : null,
    };

    return Object.assign(initialValues, config?.attributes);
  };

  const toggleDeleteConfirmationModal = () => {
    setDeleteConfirmationModalDisplayed(!deleteConfirmationModalDisplayed);
  };

  const onDeleteConfirmation = (kbID) => () => {
    onDelete(kbID);
    toggleDeleteConfirmationModal();
  };

  const getModalFooter = () => {
    return (
      <ModalFooter>
        <Button
          buttonStyle="danger"
          onClick={onDeleteConfirmation(kbId)}
          data-test-confirm-delete-kb-credentials
          data-testid='confirm-delete-button'
        >
          <FormattedMessage id="ui-eholdings.settings.kb.delete" />
        </Button>
        <Button
          onClick={toggleDeleteConfirmationModal}
          data-test-cancel-delete-kb-credentials
        >
          <FormattedMessage id="ui-eholdings.cancel" />
        </Button>
      </ModalFooter>
    );
  };

  const renderDeleteConfirmationModal = () => {
    return (
      <Modal
        size="small"
        open
        footer={getModalFooter()}
        label={<FormattedMessage id="ui-eholdings.settings.kb.delete.modalHeading" />}
        aria-label={intl.formatMessage({ id: 'ui-eholdings.settings.kb.delete.modalHeading' })}
        dismissible
        onClose={toggleDeleteConfirmationModal}
        id="delete-kb-confirmation-modal"
      >
        <SafeHTMLMessage
          id="ui-eholdings.settings.kb.delete.warning"
          values={{ kbName: currentKBName }}
        />
      </Modal>
    );
  };

  const nameFieldLabel = intl.formatMessage({ id: 'ui-eholdings.name' });
  const customerIDFieldLabel = intl.formatMessage({ id: 'ui-eholdings.settings.kb.customerId' });
  const apiKeyFieldLabel = intl.formatMessage({ id: 'ui-eholdings.settings.kb.apiKey' });
  const displayShowHidePasswordButton = config?.meta?.isKeyLoaded || isCreateMode;
  const settingsFormTitleId = isCreateMode ? 'ui-eholdings.settings.kb.new' : 'ui-eholdings.settings.kb.edit';

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={getInitialValues()}
      decorators={[focusOnErrors]}
      render={(formState) => (
        <SettingsForm
          id="knowledge-base-form"
          data-test-eholdings-settings-kb
          formState={formState}
          updateIsPending={kbCredentials.isUpdating}
          title={<FormattedMessage id={settingsFormTitleId} />}
          toasts={toasts}
          lastMenu={!isCreateMode ? (
            <IfPermission perm="ui-eholdings.settings.kb.delete">
              <Button
                buttonStyle="danger"
                onClick={toggleDeleteConfirmationModal}
                marginBottom0
                data-test-delete-kb-credentials
              >
                <FormattedMessage id="ui-eholdings.settings.kb.delete" />
              </Button>
            </IfPermission>
          ) : null}
        >
          {kbCredentials.isLoading
            ? <Icon icon="spinner-ellipsis" />
            : (
              <>
                <div data-test-eholdings-settings-kb-name>
                  <Field
                    name="name"
                    component={TextField}
                    label={nameFieldLabel}
                    aria-label={nameFieldLabel}
                    required
                    validate={validateNameField}
                    data-testid="kb-name-field"
                  />
                </div>
                <div data-test-eholdings-settings-kb-url>
                  <Field
                    name="url"
                    component={Select}
                    label={<FormattedMessage id="ui-eholdings.settings.kb.rmapiBaseUrl" />}
                  >
                    {apiEndpointsOptions.map(({ value, translationId }) => (
                      <FormattedMessage
                        id={translationId}
                        values={{ url: value }}
                      >
                        {(message) => (
                          <option value={value}>{message}</option>
                        )}
                      </FormattedMessage>
                    ))}
                  </Field>
                </div>
                <div data-test-eholdings-settings-customerid>
                  <Field
                    label={customerIDFieldLabel}
                    name="customerId"
                    component={TextField}
                    type="text"
                    autoComplete="off"
                    validate={validateCustomerId}
                    required
                    aria-label={customerIDFieldLabel}
                    data-testid="customer-id-field"
                  />
                </div>

                <div data-test-eholdings-settings-apikey>
                  <ShowHidePasswordField
                    name="apiKey"
                    autoComplete="off"
                    validate={validateApiKey}
                    required
                    label={apiKeyFieldLabel}
                    aria-label={apiKeyFieldLabel}
                    showButtonLabel={<FormattedMessage id="ui-eholdings.settings.kb.apiKey.show" />}
                    hideButtonLabel={<FormattedMessage id="ui-eholdings.settings.kb.apiKey.hide" />}
                    showButton={displayShowHidePasswordButton}
                    data-testid="api-key-field"
                  />
                </div>
                <p>
                  <FormattedMessage id="ui-eholdings.settings.kb.url.ebsco.customer.message" />
                </p>
              </>
            )}

          <NavigationModal
            label={<FormattedMessage id="ui-eholdings.navModal.areYouSure" />}
            message={<FormattedMessage id="ui-eholdings.navModal.unsavedChanges" />}
            when={!formState.pristine && isCreateMode}
          />
          {deleteConfirmationModalDisplayed && renderDeleteConfirmationModal()}
        </SettingsForm>
      )}
    />
  );
};

SettingsKnowledgeBase.propTypes = propTypes;
SettingsKnowledgeBase.defaultProps = defaultProps;

export default SettingsKnowledgeBase;
