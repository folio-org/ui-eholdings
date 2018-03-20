import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@folio/stripes-components/lib/Button';

import DetailsView from './details-view';
import Link from './link';
import KeyValueLabel from './key-value-label';
import IdentifiersList from './identifiers-list';
import ContributorsList from './contributors-list';
import ToggleSwitch from './toggle-switch';
import CoverageDateList from './coverage-date-list';
import { isBookPublicationType, isValidCoverageList } from './utilities';
import Modal from './modal';
import CustomEmbargoForm from './custom-embargo';
import CustomerResourceCoverage from './customer-resource-coverage';
import NavigationModal from './navigation-modal';
import DetailsViewSection from './details-view-section';
import Toaster from './toaster';

export default class CustomerResourceShow extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    toggleSelected: PropTypes.func.isRequired,
    toggleHidden: PropTypes.func.isRequired,
    customEmbargoSubmitted: PropTypes.func.isRequired,
    coverageSubmitted: PropTypes.func.isRequired
  };

  static contextTypes = {
    locale: PropTypes.string,
    intl: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    resourceSelected: this.props.model.isSelected,
    resourceHidden: this.props.model.visibilityData.isHidden,
    isCoverageEditable: false,
    isEmbargoEditable: false
  };

  componentWillReceiveProps({ model }) {
    if (!model.isSaving) {
      this.setState({
        resourceSelected: model.isSelected,
        resourceHidden: model.visibilityData.isHidden
      });
    }
  }

  handleSelectionToggle = () => {
    this.setState({ resourceSelected: !this.props.model.isSelected });
    if (this.props.model.isSelected) {
      this.setState({ showSelectionModal: true });
    } else {
      this.props.toggleSelected();
    }
  };

  commitSelectionToggle = () => {
    this.setState({ showSelectionModal: false });
    this.props.toggleSelected();
  };

  cancelSelectionToggle = () => {
    this.setState({
      showSelectionModal: false,
      resourceSelected: this.props.model.isSelected
    });
  };

  handleCoverageEdit = (isCoverageEditable) => {
    this.setState({ isCoverageEditable });
  };

  handleEmbargoEdit = (isEmbargoEditable) => {
    this.setState({ isEmbargoEditable });
  };

  render() {
    let { model, customEmbargoSubmitted, coverageSubmitted } = this.props;
    let hasErrors = model.update.isRejected;
    let errors = hasErrors ? model.update.errors.map((error, index) => ({
      message: error.title,
      type: 'error'
    })) : [];
    let { locale, intl } = this.context;
    let {
      showSelectionModal,
      resourceSelected,
      resourceHidden,
      isCoverageEditable,
      isEmbargoEditable
    } = this.state;

    let hasManagedCoverages = model.managedCoverages.length > 0 &&
      isValidCoverageList(model.managedCoverages);
    let hasManagedEmbargoPeriod = model.managedEmbargoPeriod &&
      model.managedEmbargoPeriod.embargoUnit &&
      model.managedEmbargoPeriod.embargoValue;
    let customEmbargoValue = model.customEmbargoPeriod && model.customEmbargoPeriod.embargoValue;
    let customEmbargoUnit = model.customEmbargoPeriod && model.customEmbargoPeriod.embargoUnit;

    // in the event that the resource lacks custom coverage, we must
    // add an artificial "blank" row of coverage at this level so
    // the form initializes correctly when adding coverage.  unfortunately,
    // due to redux-form eccentricity, we cannot do this in the CoverageForm
    // component itself.  instead we clone the coverages off the model here,
    // as mutating the model directly will break all other customizations.
    let customCoverages = [...model.customCoverages];
    if (customCoverages.length === 0 && model.isSelected) {
      customCoverages = [{
        beginCoverage: '',
        endCoverage: ''
      }];
    }


    return (
      <div>
        <Toaster toasts={errors} position="top" />

        <DetailsView
          type="resource"
          model={model}
          paneTitle={model.name}
          paneSub={model.packageName}
          bodyContent={(
            <div>
              <DetailsViewSection label="Holding status">
                <label
                  data-test-eholdings-customer-resource-show-selected
                  htmlFor="customer-resource-show-toggle-switch"
                >
                  <h4>{resourceSelected ? 'Selected' : 'Not selected'}</h4>
                  <br />
                  <ToggleSwitch
                    onChange={this.handleSelectionToggle}
                    checked={resourceSelected}
                    isPending={model.update.isPending && 'isSelected' in model.update.changedAttributes}
                    id="customer-resource-show-toggle-switch"
                  />
                </label>
              </DetailsViewSection>
              <DetailsViewSection label="Visibility">
                {resourceSelected ? (
                  <div>
                    <label
                      data-test-eholdings-customer-resource-toggle-hidden
                      htmlFor="customer-resource-show-hide-toggle-switch"
                    >
                      <h4>
                        {model.visibilityData.isHidden
                          ? 'Hidden from patrons'
                          : 'Visible to patrons'}
                      </h4>
                      <br />
                      <ToggleSwitch
                        onChange={this.props.toggleHidden}
                        checked={!resourceHidden}
                        isPending={model.update.isPending &&
                          ('visibilityData' in model.update.changedAttributes)}
                        id="customer-resource-show-hide-toggle-switch"
                      />
                    </label>

                    {model.visibilityData.isHidden && (
                      <div data-test-eholdings-customer-resource-toggle-hidden-reason>
                        {model.package.visibilityData.isHidden
                          ? 'All titles in this package are hidden.'
                          : model.visibilityData.reason}
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Not shown to patrons.</p>
                )}
              </DetailsViewSection>
              <DetailsViewSection
                label="Coverage dates"
                closedByDefault={!hasManagedCoverages && !resourceSelected}
              >
                {hasManagedCoverages && (
                  <KeyValueLabel label="Managed coverage dates">
                    <div data-test-eholdings-customer-resource-show-managed-coverage-list>
                      <CoverageDateList
                        coverageArray={model.managedCoverages}
                        isYearOnly={isBookPublicationType(model.publicationType)}
                      />
                    </div>
                  </KeyValueLabel>
                )}

                {resourceSelected && (
                  <CustomerResourceCoverage
                    initialValues={{ customCoverages }}
                    packageCoverage={model.package.customCoverage}
                    isEditable={isCoverageEditable}
                    onEdit={this.handleCoverageEdit}
                    onSubmit={coverageSubmitted}
                    isPending={model.update.isPending && 'customCoverages' in model.update.changedAttributes}
                    locale={locale}
                    intl={intl}
                  />
                )}

                {!hasManagedCoverages && !resourceSelected && (
                  <p>Add the resource to holdings to set custom coverage dates.</p>
                )}

              </DetailsViewSection>
              <DetailsViewSection
                label="Embargo period"
                closedByDefault={!hasManagedEmbargoPeriod && !resourceSelected}
              >
                {hasManagedEmbargoPeriod && (
                  <KeyValueLabel label="Managed embargo period">
                    <div data-test-eholdings-customer-resource-show-managed-embargo-period>
                      {model.managedEmbargoPeriod.embargoValue} {model.managedEmbargoPeriod.embargoUnit}
                    </div>
                  </KeyValueLabel>
                )}

                {resourceSelected && (
                  <CustomEmbargoForm
                    initialValues={{ customEmbargoValue, customEmbargoUnit }}
                    isEditable={isEmbargoEditable}
                    onEdit={this.handleEmbargoEdit}
                    onSubmit={customEmbargoSubmitted}
                    isPending={model.update.isPending && 'customEmbargoPeriod' in model.update.changedAttributes}
                  />
                )}

                {!hasManagedEmbargoPeriod && !resourceSelected && (
                  <p>Add the resource to holdings to set an custom embargo period.</p>
                )}

              </DetailsViewSection>

              <DetailsViewSection label="Resource information">

                <ContributorsList data={model.contributors} />

                <KeyValueLabel label="Publisher">
                  <div data-test-eholdings-customer-resource-show-publisher-name>
                    {model.publisherName}
                  </div>
                </KeyValueLabel>

                {model.publicationType && (
                  <KeyValueLabel label="Publication type">
                    <div data-test-eholdings-customer-resource-show-publication-type>
                      {model.publicationType}
                    </div>
                  </KeyValueLabel>
                )}

                <IdentifiersList data={model.identifiers} />

                {model.subjects.length > 0 && (
                  <KeyValueLabel label="Subjects">
                    <div data-test-eholdings-customer-resource-show-subjects-list>
                      {model.subjects.map(subjectObj => subjectObj.subject).join('; ')}
                    </div>
                  </KeyValueLabel>
                )}

                <KeyValueLabel label="Provider">
                  <div data-test-eholdings-customer-resource-show-provider-name>
                    <Link to={`/eholdings/providers/${model.providerId}`}>{model.providerName}</Link>
                  </div>
                </KeyValueLabel>

                <KeyValueLabel label="Package">
                  <div data-test-eholdings-customer-resource-show-package-name>
                    <Link to={`/eholdings/packages/${model.packageId}`}>{model.packageName}</Link>
                  </div>
                </KeyValueLabel>

                <KeyValueLabel label="Other packages">
                  <Link to={`/eholdings/titles/${model.titleId}`}>
                    View all packages that include this title
                  </Link>
                </KeyValueLabel>

                {model.contentType && (
                  <KeyValueLabel label="Content type">
                    <div data-test-eholdings-customer-resource-show-content-type>
                      {model.contentType}
                    </div>
                  </KeyValueLabel>
                )}

                {model.url && (
                  <KeyValueLabel label="Managed URL">
                    <div data-test-eholdings-customer-resource-show-managed-url>
                      <a href={model.url} target="_blank">{model.url}</a>
                    </div>
                  </KeyValueLabel>
                )}
              </DetailsViewSection>
            </div>
          )}
        />

        <Modal
          open={showSelectionModal}
          size="small"
          label="Remove resource from holdings?"
          scope="root"
          id="eholdings-customer-resource-deselection-confirmation-modal"
          footer={(
            <div>
              <Button
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
                data-test-eholdings-customer-resource-deselection-confirmation-modal-yes
              >
                Yes, remove
              </Button>
              <Button
                onClick={this.cancelSelectionToggle}
                data-test-eholdings-customer-resource-deselection-confirmation-modal-no
              >
                No, do not remove
              </Button>
            </div>
          )}
        >
          {
            /*
               we use <= here to account for the case where a user
               selects and then immediately deselects the
               customerResource
            */
            model.package.selectedCount <= 1 ? (
              <span data-test-eholdings-deselect-final-title-warning>
                Are you sure you want to remove this title from your holdings?
                It is also the last title selected in this package. By removing
                this title, you will also remove this package from your holdings
                and all customizations will be lost.
              </span>
            ) : (
              <span data-test-eholdings-deselect-title-warning>
                Are you sure you want to remove this title from your holdings?
                All customizations will be lost.
              </span>
            )
          }
        </Modal>

        <NavigationModal when={isCoverageEditable || isEmbargoEditable} />
      </div>
    );
  }
}
