import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';

import {
  Button,
  IconButton,
  Pane,
  Paneset,
  PaneFooter,
} from '@folio/stripes/components';

import { FormattedMessage } from 'react-intl';
import DetailsViewSection from '../../details-view-section';
import NameField from '../_fields/name';
import EditionField from '../_fields/edition';
import PublisherNameField from '../_fields/publisher-name';
import PackageSelectField from '../_fields/package-select';
import ContributorField from '../_fields/contributor';
import IdentifiersFields from '../_fields/identifiers';
import DescriptionField from '../_fields/description';
import PublicationTypeField from '../_fields/publication-type';
import PeerReviewedField from '../_fields/peer-reviewed';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import styles from './title-create.css';

const focusOnErrors = createFocusDecorator();
const paneTitle = <FormattedMessage id="ui-eholdings.title.create.paneTitle" />;

export default class TitleCreate extends Component {
  static propTypes = {
    customPackages: PropTypes.object.isRequired,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    removeCreateRequests: PropTypes.func.isRequired,
    request: PropTypes.object.isRequired,
  };

  componentWillUnmount() {
    this.props.removeCreateRequests();
  }

  renderFirstMenu = () => {
    const { onCancel } = this.props;

    return (
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
    );
  };

  getFooter = (pristine, reset) => {
    const { request } = this.props;

    const cancelButton = (
      <Button
        data-test-eholdings-title-create-cancel-button
        buttonStyle="default mega"
        disabled={request.isPending || pristine}
        onClick={reset}
        marginBottom0
      >
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        buttonStyle="primary mega"
        data-test-eholdings-title-create-save-button
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
  }

  render() {
    const {
      customPackages,
      onSubmit,
      request
    } = this.props;

    const packageOptions = customPackages.map(pkg => ({
      label: pkg.name,
      value: pkg.id
    }));

    return (
      <div data-test-eholdings-title-create>
        <Toaster
          position="bottom"
          toasts={request.errors.map(({ title }, index) => ({
            id: `error-${request.timestamp}-${index}`,
            message: title,
            type: 'error'
          }))}
        />
        <Form
          onSubmit={onSubmit}
          initialValues={{
            publicationType: 'Unspecified'
          }}
          decorators={[focusOnErrors]}
          mutators={{ ...arrayMutators }}
          render={({ handleSubmit, pristine, form: { reset } }) => (
            <>
              <Paneset>
                <Pane
                  onSubmit={handleSubmit}
                  tagName="form"
                  defaultWidth="fill"
                  paneTitle={paneTitle}
                  firstMenu={this.renderFirstMenu()}
                  footer={this.getFooter(pristine, reset)}
                >
                  <div className={styles['title-create-form-container']}>
                    <DetailsViewSection
                      label={<FormattedMessage id="ui-eholdings.title.titleInformation" />}
                      separator={false}
                    >
                      <NameField />
                      <ContributorField />
                      <EditionField />
                      <PublisherNameField />
                      <PublicationTypeField />
                      <IdentifiersFields />
                      <DescriptionField />
                      <PeerReviewedField />
                    </DetailsViewSection>
                    <DetailsViewSection
                      label={<FormattedMessage id="ui-eholdings.label.packageInformation" />}
                    >
                      <PackageSelectField options={packageOptions} />
                    </DetailsViewSection>
                  </div>
                </Pane>
              </Paneset>

              <NavigationModal when={!pristine && !request.isPending && !request.isResolved} />
            </>
          )}
        />
      </div>
    );
  }
}
