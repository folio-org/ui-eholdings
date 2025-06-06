import {
  createRef,
  Component,
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
import KeyShortcutsWrapper from '../../key-shortcuts-wrapper';

import styles from './title-create.css';

const focusOnErrors = createFocusDecorator();
const paneTitle = <FormattedMessage id="ui-eholdings.title.create.paneTitle" />;

class TitleCreate extends Component {
  static propTypes = {
    customPackages: PropTypes.object.isRequired,
    onCancel: PropTypes.func,
    onPackageFilter: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    removeCreateRequests: PropTypes.func.isRequired,
    request: PropTypes.object.isRequired,
  };

  componentWillUnmount() {
    this.props.removeCreateRequests();
  }

  createFormRef = createRef();

  renderFirstMenu = () => {
    const { onCancel } = this.props;

    return (
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
    );
  };

  getFooter = (pristine) => {
    const {
      request,
      onCancel,
    } = this.props;

    const cancelButton = (
      <Button
        data-test-eholdings-title-create-cancel-button
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
  };

  render() {
    const {
      customPackages,
      onSubmit,
      request,
      onPackageFilter,
    } = this.props;

    const packageOptions = customPackages.map(pkg => ({
      label: pkg.name,
      value: pkg.id,
    }));

    return (
      <KeyShortcutsWrapper formRef={this.createFormRef.current}>
        <div
          data-test-eholdings-title-create
          data-testid="title-create"
        >
          <Toaster
            position="bottom"
            toasts={request.errors.map(({ title }, index) => ({
              id: `error-${request.timestamp}-${index}`,
              message: title,
              type: 'error',
            }))}
          />
          <Form
            onSubmit={onSubmit}
            initialValues={{
              publicationType: 'Unspecified',
            }}
            decorators={[focusOnErrors]}
            mutators={{ ...arrayMutators }}
            render={({ handleSubmit, pristine }) => (
              <form
                ref={this.createFormRef}
                onSubmit={handleSubmit}
                noValidate
              >
                <Paneset>
                  <Pane
                    defaultWidth="fill"
                    paneTitle={paneTitle}
                    firstMenu={this.renderFirstMenu()}
                    footer={this.getFooter(pristine)}
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
                        <PackageSelectField
                          options={packageOptions}
                          onFilter={onPackageFilter}
                          loadingOptions={customPackages.isLoading}
                        />
                      </DetailsViewSection>
                    </div>
                  </Pane>
                </Paneset>

                <NavigationModal when={!pristine && !request.isPending && !request.isResolved} />
              </form>
            )}
          />
        </div>
      </KeyShortcutsWrapper>
    );
  }
}

export default TitleCreate;
