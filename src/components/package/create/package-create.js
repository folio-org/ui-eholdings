import { createRef, Component } from 'react';
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

import DetailsViewSection from '../../details-view-section';
import NameField from '../_fields/name';
import CoverageFields from '../_fields/custom-coverage';
import ContentTypeField from '../_fields/content-type';
import NavigationModal from '../../navigation-modal';
import AccessTypeEditSection from '../../access-type-edit-section';

import Toaster from '../../toaster';
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

class PackageCreate extends Component {
  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    removeCreateRequests: PropTypes.func.isRequired,
    request: PropTypes.object.isRequired,
  };

  componentWillUnmount() {
    this.props.removeCreateRequests();
  }

  createFormRef = createRef();

  getFooter = (pristine) => {
    const {
      request,
      onCancel,
    } = this.props;

    const cancelButton = (
      <Button
        data-test-eholdings-package-create-cancel-button
        buttonStyle="default mega"
        disabled={request.isPending || pristine}
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
        disabled={request.isPending || pristine}
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
  };

  getFirstMenu = () => {
    const { onCancel } = this.props;

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
  };

  render() {
    const {
      request,
      onSubmit,
      accessStatusTypes,
    } = this.props;

    return (
      <KeyShortcutsWrapper formRef={this.createFormRef.current}>
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
              <Toaster
                position="bottom"
                toasts={request.errors.map(({ title }, index) => ({
                  id: `error-${request.timestamp}-${index}`,
                  message: title,
                  type: 'error',
                }))}
              />
              <form
                ref={this.createFormRef}
                onSubmit={handleSubmit}
                noValidate
              >
                <Paneset>
                  <Pane
                    defaultWidth="fill"
                    paneTitle={paneTitle}
                    firstMenu={this.getFirstMenu()}
                    footer={this.getFooter(pristine)}
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

              <NavigationModal when={!pristine && !request.isPending && !request.isResolved} />
            </div>
          )}
        />
      </KeyShortcutsWrapper>
    );
  }
}

export default PackageCreate;
