import {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Form } from 'react-final-form';
import {
  isEqual,
  pickBy,
} from 'lodash';

import {
  Col,
  ConfirmationModal,
  KeyValue,
  Row,
  Headline,
} from '@folio/stripes/components';

import CustomLabelField from './custom-label-field';
import SettingsForm from '../settings-form';
import NavigationModal from '../../navigation-modal';
import { formatCustomLabelsValues } from '../../utilities';

const SettingsCustomLabels = ({
  confirmUpdate,
  credentialId,
  customLabels,
  updateCustomLabels,
}) => {
  const intl = useIntl();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [removingLabels, setRemovingLabels] = useState('');

  useEffect(() => {
    if (customLabels.isUpdated) {
      confirmUpdate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customLabels.isUpdated]);

  const closeModal = () => setModalIsOpen(false);

  const prepareInitialValues = () => {
    const { items: { data } } = customLabels;

    return data
      ? data.reduce((acc, { attributes }) => {
        const {
          id,
          displayLabel,
          displayOnFullTextFinder,
          displayOnPublicationFinder,
        } = attributes;

        return {
          ...acc,
          [`customLabel${id}`]: {
            displayLabel,
            displayOnFullTextFinder,
            displayOnPublicationFinder,
          },
        };
      }, {})
      : {};
  };

  const removeCustomLabels = ({ values }) => {
    const formattedFormValues = formatCustomLabelsValues(values);

    updateCustomLabels(formattedFormValues, credentialId);
    closeModal();
  };

  const getRemovingCustomLabels = (formValues, formInitialValues) => {
    const fieldsToDelete = pickBy(formInitialValues, (value, key) => (formValues[key].displayLabel === undefined));
    const labelsToRemove = Object.values(fieldsToDelete).map(value => value.displayLabel);

    return labelsToRemove.join(', ');
  };

  const onSubmit = (formValues, { getState }) => {
    const { initialValues } = getState();

    const labelsToRemove = getRemovingCustomLabels(formValues, initialValues);

    if (labelsToRemove.length !== 0) {
      setModalIsOpen(true);
      setRemovingLabels(labelsToRemove);
    } else {
      const formattedFormValues = formatCustomLabelsValues(formValues);

      updateCustomLabels(formattedFormValues, credentialId);
    }
  };

  const getToastLabels = () => {
    const {
      errors,
      isUpdated,
    } = customLabels;

    if (isUpdated) {
      return [{
        message: <FormattedMessage id='ui-eholdings.settings.customLabels.toast' />,
        type: 'success',
        id: `update-custom-labels-success-${Date.now()}`,
      }];
    } else {
      return errors.map((error, index) => ({
        id: `error-${index}`,
        message: error.title,
        type: 'error',
      }));
    }
  };

  const initialValues = prepareInitialValues();

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      initialValuesEqual={isEqual}
      render={(formState) => (
        <SettingsForm
          data-test-eholdings-settings-custom-labels
          data-testid="settings-custom-labels-form"
          id="custom-labels-form"
          formState={formState}
          title={<FormattedMessage id="ui-eholdings.resource.customLabels" />}
          toasts={getToastLabels()}
        >
          <Row>
            <Col xs={4}>
              <Headline tag="h3">
                <FormattedMessage id="ui-eholdings.settings.customLabels.displayLabel" />
              </Headline>
            </Col>
            <Col xs={4}>
              <Headline tag="h3">
                <FormattedMessage id="ui-eholdings.settings.customLabels.publicationFinder" />
              </Headline>
            </Col>
            <Col xs={4}>
              <Headline tag="h3">
                <FormattedMessage id="ui-eholdings.settings.customLabels.textFinder" />
              </Headline>
            </Col>
          </Row>

          <CustomLabelField name='customLabel1' />
          <CustomLabelField name='customLabel2' />
          <CustomLabelField name='customLabel3' />
          <CustomLabelField name='customLabel4' />
          <CustomLabelField name='customLabel5' />

          <NavigationModal
            label={<FormattedMessage id="ui-eholdings.navModal.areYouSure" />}
            message={<FormattedMessage id="ui-eholdings.navModal.unsavedChanges" />}
            when={!formState.pristine && !isEqual(formState.values, initialValues)}
          />

          <ConfirmationModal
            confirmLabel={<FormattedMessage id="ui-eholdings.settings.customLabels.remove" />}
            id="confirmation-modal"
            data-testid="outer-confirmation-modal"
            heading={<FormattedMessage id="ui-eholdings.settings.customLabels.remove" />}
            ariaLabel={intl.formatMessage({ id: 'ui-eholdings.settings.customLabels.remove' })}
            message={
              <>
                <FormattedMessage
                  id="ui-eholdings.settings.customLabels.remove.description"
                  values={{ label: removingLabels }}
                />
                <br />
                <FormattedMessage id="ui-eholdings.settings.customLabels.remove.note" />
              </>
            }
            onCancel={closeModal}
            onConfirm={() => removeCustomLabels(formState)}
            open={modalIsOpen}
          />
        </SettingsForm>
      )}
    />
  );
};

SettingsCustomLabels.propTypes = {
  confirmUpdate: PropTypes.func.isRequired,
  credentialId: PropTypes.string.isRequired,
  customLabels: PropTypes.shape({
    errors: PropTypes.array.isRequired,
    isUpdated: PropTypes.bool.isRequired,
    items: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.shape({
        attributes: PropTypes.shape({
          displayLabel: PropTypes.string,
          displayOnFullTextFinder: PropTypes.bool,
          displayOnPublicationFinder: PropTypes.bool,
          id: PropTypes.number,
        }),
      })),
    }).isRequired,
  }).isRequired,
  updateCustomLabels: PropTypes.func.isRequired,
};

export default SettingsCustomLabels;
