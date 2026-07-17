import {
  useRef,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  IconButton,
  Pane,
  Paneset,
  PaneFooter,
} from '@folio/stripes/components';
import { useCallout } from '@folio/stripes/core';

import DetailsViewSection from '../../details-view-section';
import NameField from '../_fields/name';
import CoverageFields from '../_fields/custom-coverage';
import ContentTypeField from '../_fields/content-type';
import NavigationModal from '../../navigation-modal';
import AccessTypeEditSection from '../../access-type-edit-section';

import KeyShortcutsWrapper from '../../key-shortcuts-wrapper';

import { accessTypesReduxStateShape } from '../../../constants';

import styles from './package-create.css';

const initialValues = {
  name: '',
  contentType: 'Unknown',
  customCoverages: [],
};

const focusOnErrors = createFocusDecorator();
const paneTitle = <FormattedMessage id="ui-eholdings.package.create.custom" />;

const propTypes = {
  accessStatusTypes: accessTypesReduxStateShape.isRequired,
  isPackageCreateLoading: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  packageCreateErrors: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })),
};

const PackageCreate = ({
  accessStatusTypes,
  onCancel,
  onSubmit,
  isPackageCreateLoading,
  packageCreateErrors = [],
}) => {
  const createFormRef = useRef();

  const callout = useCallout();

  useEffect(() => {
    packageCreateErrors.forEach(({ title }, index) => {
      callout.sendCallout({
        id: `error-${index}`,
        message: title,
        type: 'error',
      });
    });
  }, [packageCreateErrors, callout]);

  const getFooter = useCallback(pristine => {
    const cancelButton = (
      <Button
        data-test-eholdings-package-create-cancel-button
        buttonStyle="default mega"
        disabled={isPackageCreateLoading || pristine}
        onClick={onCancel}
        marginBottom0
      >
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        buttonStyle="primary mega"
        data-test-eholdings-package-create-save-button
        disabled={isPackageCreateLoading || pristine}
        marginBottom0
        type="submit"
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderStart={cancelButton}
        renderEnd={saveButton}
      />
    );
  }, [onCancel, isPackageCreateLoading]);

  const getFirstMenu = useCallback(() => {
    return onCancel
      ? (
        <FormattedMessage
          id="ui-eholdings.label.icon.closeX"
          values={{ paneTitle }}
        >
          {([ariaLabel]) => (
            <IconButton
              icon="times"
              ariaLabel={ariaLabel}
              onClick={onCancel}
              data-test-eholdings-details-view-back-button
            />
          )}
        </FormattedMessage>
      )
      : null;
  }, [onCancel]);

  return (
    <KeyShortcutsWrapper formRef={createFormRef.current}>
      <Form
        initialValues={initialValues}
        decorators={[focusOnErrors]}
        mutators={{ ...arrayMutators }}
        onSubmit={onSubmit}
        render={({ handleSubmit, pristine, }) => (
          <div
            data-test-eholdings-package-create
            data-testid="data-test-eholdings-package-create"
          >
            <form
              ref={createFormRef}
              onSubmit={handleSubmit}
              noValidate
            >
              <Paneset>
                <Pane
                  defaultWidth="fill"
                  paneTitle={paneTitle}
                  firstMenu={getFirstMenu()}
                  footer={getFooter(pristine)}
                >
                  <div className={styles['package-create-form-container']}>
                    <DetailsViewSection
                      label={<FormattedMessage id="ui-eholdings.package.packageInformation" />}
                      separator={false}
                    >
                      <NameField />
                      <ContentTypeField />
                      <AccessTypeEditSection accessStatusTypes={accessStatusTypes} />
                    </DetailsViewSection>
                    <DetailsViewSection
                      label={<FormattedMessage id="ui-eholdings.label.coverageSettings" />}
                    >
                      <CoverageFields />
                    </DetailsViewSection>
                  </div>
                </Pane>
              </Paneset>
            </form>

            <NavigationModal when={!pristine && !isPackageCreateLoading} />
          </div>
        )}
      />
    </KeyShortcutsWrapper>
  );
};

PackageCreate.propTypes = propTypes;

export { PackageCreate };
