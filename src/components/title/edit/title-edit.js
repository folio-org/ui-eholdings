import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';

import {
  Button,
  PaneFooter
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import DetailsView from '../../details-view';
import NameField from '../_fields/name';
import EditionField from '../_fields/edition';
import PublisherNameField from '../_fields/publisher-name';
import PublicationTypeField from '../_fields/publication-type';
import IdentifiersFields from '../_fields/identifiers';
import DescriptionField from '../_fields/description';
import ContributorField from '../_fields/contributor';
import PeerReviewedField from '../_fields/peer-reviewed';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';

const focusOnErrors = createFocusDecorator();

export default class TitleEdit extends Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    updateRequest: PropTypes.object.isRequired,
  };

  getFooter = (pristine, reset) => {
    const { model } = this.props;

    const cancelButton = (
      <Button
        data-test-eholdings-title-edit-cancel-button
        buttonStyle="default mega"
        disabled={model.update.isPending || pristine}
        onClick={reset}
        marginBottom0
      >
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        buttonStyle="primary mega"
        data-test-eholdings-title-save-button
        disabled={model.update.isPending || pristine}
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
      model,
      onSubmit,
      updateRequest,
      initialValues,
      onCancel,
    } = this.props;

    return (
      <>
        <Toaster
          position="bottom"
          toasts={updateRequest.errors.map(({ title }, index) => ({
            id: `error-${updateRequest.timestamp}-${index}`,
            message: title,
            type: 'error'
          }))}
        />
        <Form
          onSubmit={onSubmit}
          initialValues={initialValues}
          initialValuesEqual={() => true}
          decorators={[focusOnErrors]}
          mutators={{ ...arrayMutators }}
          render={({ handleSubmit, pristine, form: { reset } }) => (
            <>
              <form onSubmit={handleSubmit}>
                <DetailsView
                  type="title"
                  model={model}
                  paneTitle={model.name}
                  footer={this.getFooter(pristine, reset)}
                  bodyContent={(
                    <>
                      <DetailsViewSection
                        label={<FormattedMessage id="ui-eholdings.title.titleInformation" />}
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
                    </>
                  )}
                  onCancel={onCancel}
                />
              </form>

              <NavigationModal when={!pristine && !updateRequest.isResolved} />
            </>
          )}
        />
      </>
    );
  }
}
