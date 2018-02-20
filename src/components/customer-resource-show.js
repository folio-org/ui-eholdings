import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@folio/stripes-components/lib/IconButton';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Button from '@folio/stripes-components/lib/Button';
import Layout from '@folio/stripes-components/lib/Layout';

import DetailsView from './details-view';
import Link from './link';
import KeyValueLabel from './key-value-label';
import IdentifiersList from './identifiers-list';
import ContributorsList from './contributors-list';
import ToggleSwitch from './toggle-switch';
import CoverageDateList from './coverage-date-list';
import { isBookPublicationType, isValidCoverageList } from './utilities';
import Modal from './modal';
import styles from './styles.css';
import CustomEmbargoForm from './custom-embargo';
import CustomerResourceCoverage from './customer-resource-coverage';

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
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    resourceSelected: this.props.model.isSelected,
    resourceHidden: this.props.model.visibilityData.isHidden
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

  render() {
    let { model, customEmbargoSubmitted, coverageSubmitted } = this.props;
    let { locale, router, queryParams } = this.context;
    let { showSelectionModal, resourceSelected, resourceHidden } = this.state;

    let historyState = router.history.location.state;
    let hasManagedCoverages = model.managedCoverages.length > 0 &&
      isValidCoverageList(model.managedCoverages);
    let hasManagedEmbargoPeriod = model.managedEmbargoPeriod &&
      model.managedEmbargoPeriod.embargoUnit &&
      model.managedEmbargoPeriod.embargoValue;
    let customEmbargoValue = model.customEmbargoPeriod && model.customEmbargoPeriod.embargoValue;
    let customEmbargoUnit = model.customEmbargoPeriod && model.customEmbargoPeriod.embargoUnit;

    let customCoverages = model.customCoverages;
    if (customCoverages.length === 0) {
      customCoverages.push({
        beginCoverage: '',
        endCoverage: ''
      });
    }

    return (
      <div>
        <DetailsView
          type="resource"
          model={model}
          showPaneHeader={!queryParams.searchType}
          paneHeaderFirstMenu={historyState && historyState.eholdings && (
            <PaneMenu>
              <div data-test-eholdings-customer-resource-show-back-button>
                <IconButton icon="left-arrow" onClick={() => router.history.goBack()} />
              </div>
            </PaneMenu>
          )}
          bodyContent={(
            <div>
              <ContributorsList data={model.contributors} />

              <KeyValueLabel label="Publisher">
                <div data-test-eholdings-customer-resource-show-publisher-name>
                  {model.publisherName}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Publication type">
                <div data-test-eholdings-customer-resource-show-publication-type>
                  {model.publicationType}
                </div>
              </KeyValueLabel>

              <IdentifiersList data={model.identifiers} />

              {model.subjects.length > 0 && (
                <KeyValueLabel label="Subjects">
                  <div data-test-eholdings-customer-resource-show-subjects-list>
                    {model.subjects.map(subjectObj => subjectObj.subject).join('; ')}
                  </div>
                </KeyValueLabel>
              )}

              <KeyValueLabel label="Package">
                <div data-test-eholdings-customer-resource-show-package-name>
                  <Link to={`/eholdings/packages/${model.packageId}`}>{model.packageName}</Link>
                </div>
              </KeyValueLabel>

              {model.contentType && (
                <KeyValueLabel label="Content type">
                  <div data-test-eholdings-customer-resource-show-content-type>
                    {model.contentType}
                  </div>
                </KeyValueLabel>
              )}

              <KeyValueLabel label="Provider">
                <div data-test-eholdings-customer-resource-show-provider-name>
                  <Link to={`/eholdings/providers/${model.providerId}`}>{model.providerName}</Link>
                </div>
              </KeyValueLabel>

              {model.url && (
                <KeyValueLabel label="Managed URL">
                  <div data-test-eholdings-customer-resource-show-managed-url>
                    <a href={model.url} target="_blank">{model.url}</a>
                  </div>
                </KeyValueLabel>
              )}

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

              {hasManagedEmbargoPeriod && (
                <KeyValueLabel label="Managed embargo period">
                  <div data-test-eholdings-customer-resource-show-managed-embargo-period>
                    {model.managedEmbargoPeriod.embargoValue} {model.managedEmbargoPeriod.embargoUnit}
                  </div>
                </KeyValueLabel>
              )}

              <hr />

              <label
                data-test-eholdings-customer-resource-show-selected
                htmlFor="customer-resource-show-toggle-switch"
              >
                <h4>{resourceSelected ? 'Selected' : 'Not selected'}</h4>
                <ToggleSwitch
                  onChange={this.handleSelectionToggle}
                  checked={resourceSelected}
                  isPending={model.update.isPending && 'isSelected' in model.update.changedAttributes}
                  id="customer-resource-show-toggle-switch"
                />
              </label>

              {resourceSelected && (
                <div>
                  <hr />
                  <label
                    data-test-eholdings-customer-resource-toggle-hidden
                    htmlFor="customer-resource-show-hide-toggle-switch"
                  >
                    <h4>
                      {model.visibilityData.isHidden
                        ? 'Hidden from patrons'
                        : 'Visible to patrons'}
                    </h4>

                    <Layout className="flex">
                      <div className={styles.marginRightHalf}>
                        {model.package.visibilityData.isHidden ? (
                          <ToggleSwitch
                            id="customer-resource-show-hide-toggle-switch"
                            checked={false}
                            disabled
                          />
                        ) : (
                          <ToggleSwitch
                            onChange={this.props.toggleHidden}
                            checked={!resourceHidden}
                            isPending={model.update.isPending &&
                              ('visibilityData' in model.update.changedAttributes)}
                            id="customer-resource-show-hide-toggle-switch"
                          />
                        )}
                      </div>

                      {model.visibilityData.isHidden && (
                        <div data-test-eholdings-customer-resource-toggle-hidden-reason>
                          {model.package.visibilityData.isHidden
                            ? 'All titles in this package are hidden.'
                            : model.visibilityData.reason}
                        </div>
                      )}
                    </Layout>
                  </label>

                  <hr />

                  <CustomerResourceCoverage
                    initialValues={{ customCoverages }}
                    onSubmit={coverageSubmitted}
                    isPending={model.update.isPending && 'customCoverages' in model.update.changedAttributes}
                    locale={locale}
                  />

                  <hr />

                  <CustomEmbargoForm
                    initialValues={{ customEmbargoValue, customEmbargoUnit }}
                    onSubmit={customEmbargoSubmitted}
                    isPending={model.update.isPending && 'customEmbargoPeriod' in model.update.changedAttributes}
                  />
                </div>
              )}

              <hr />

              <div>
                <Link to={`/eholdings/titles/${model.titleId}`}>
                  View all packages that include this title
                </Link>
              </div>
            </div>
          )}
        />

        <Modal
          open={showSelectionModal}
          size="small"
          label="Remove resource from holdings?"
          scope="root"
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
      </div>
    );
  }
}
