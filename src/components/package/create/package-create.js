import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
  IconButton,
} from '@folio/stripes/components';

import Paneset, { Pane } from '../../paneset';
import DetailsViewSection from '../../details-view-section';
import NameField from '../_fields/name';
import CoverageFields from '../_fields/custom-coverage';
import ContentTypeField from '../_fields/content-type';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import styles from './package-create.css';

const initialValues = {
  name: '',
  contentType: 'Unknown',
  customCoverages: []
};

const focusOnErrors = createFocusDecorator();

export default class PackageCreate extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    removeCreateRequests: PropTypes.func.isRequired,
    request: PropTypes.object.isRequired
  };

  componentWillUnmount() {
    this.props.removeCreateRequests();
  }

  getActionMenu = ({ onToggle }) => {
    const {
      request,
      onCancel
    } = this.props;

    return onCancel ? (
      <Button
        data-test-eholdings-package-create-cancel-action
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          onCancel();
        }}
        disabled={request.isPending}
      >
        <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />
      </Button>
    ) : null;
  }

  render() {
    let {
      request,
      onCancel,
      onSubmit,
    } = this.props;

    const paneTitle = <FormattedMessage id="ui-eholdings.package.create.custom" />;

    return (
      <Form
        initialValues={initialValues}
        decorators={[focusOnErrors]}
        mutators={{ ...arrayMutators }}
        onSubmit={onSubmit}
        render={({ handleSubmit, pristine }) => (
          <div data-test-eholdings-package-create>
            <Toaster
              position="bottom"
              toasts={request.errors.map(({ title }, index) => ({
                id: `error-${request.timestamp}-${index}`,
                message: title,
                type: 'error'
              }))}
            />

            <Paneset>
              <Pane
                onSubmit={handleSubmit}
                tagName="form"
                flexGrow={1}
                paneTitle={paneTitle}
                actionMenu={this.getActionMenu}
                firstMenu={onCancel && (
                  <FormattedMessage
                    id="ui-eholdings.label.icon.closeX"
                    values={{ paneTitle }}
                  >
                    {ariaLabel => (
                      <IconButton
                        icon="times"
                        ariaLabel={ariaLabel}
                        onClick={onCancel}
                        data-test-eholdings-details-view-back-button
                      />
                    )}
                  </FormattedMessage>
                )}
                lastMenu={(
                  <Fragment>
                    {request.isPending && (
                      <Icon icon="spinner-ellipsis" />
                    )}
                    <PaneHeaderButton
                      disabled={pristine || request.isPending}
                      type="submit"
                      buttonStyle="primary"
                      data-test-eholdings-package-create-save-button
                    >
                      {request.isPending ?
                        (<FormattedMessage id="ui-eholdings.saving" />)
                        : (<FormattedMessage id="ui-eholdings.save" />)
                      }
                    </PaneHeaderButton>
                  </Fragment>
                )}
              >
                <div className={styles['package-create-form-container']}>
                  <DetailsViewSection
                    label={<FormattedMessage id="ui-eholdings.package.packageInformation" />}
                    separator={false}
                  >
                    <NameField />
                    <ContentTypeField />
                  </DetailsViewSection>
                  <DetailsViewSection
                    label={<FormattedMessage id="ui-eholdings.label.coverageSettings" />}
                  >
                    <CoverageFields />
                  </DetailsViewSection>
                </div>
              </Pane>
            </Paneset>

            <NavigationModal when={!pristine && !request.isPending && !request.isResolved} />
          </div>
        )}
      />
    );
  }
}
