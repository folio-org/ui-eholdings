import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'lodash/fp/update';
import set from 'lodash/fp/set';
import {
  Accordion,
  Icon,
  IconButton,
  KeyValue,
  Modal,
  ModalFooter
} from '@folio/stripes-components';
import { intlShape, injectIntl, FormattedDate, FormattedNumber, FormattedMessage } from 'react-intl';
import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import QueryList from '../../query-list';
import Link from '../../link';
import TitleListItem from '../../title-list-item';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';

import SelectionStatus from '../selection-status';
import styles from './package-show.css';

class PackageShow extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    fetchPackageTitles: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    toggleSelected: PropTypes.func.isRequired,
    addPackageToHoldings: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    packageSelected: this.props.model.isSelected,
    packageAllowedToAddTitles: this.props.model.allowKbToAddTitles,
    isCoverageEditable: false,
    sections: {
      packageShowHoldingStatus: true,
      packageShowInformation: true,
      packageShowSettings: true,
      packageShowCoverageSettings: true,
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { model: { allowKbToAddTitles, isSaving, isSelected } } = nextProps;
    if (!isSaving) {
      return {
        ...prevState,
        packageSelected: isSelected,
        packageAllowedToAddTitles: allowKbToAddTitles
      };
    }
    return prevState;
  }

  handleSelectionToggle = () => {
    this.setState({ packageSelected: !this.props.model.isSelected });
    if (this.props.model.isSelected) {
      this.setState({ showSelectionModal: true });
    } else {
      this.setState({ packageAllowedToAddTitles: true });
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
      packageSelected: this.props.model.isSelected
    });
  };

  handleCoverageEdit = (isCoverageEditable) => {
    this.setState({ isCoverageEditable });
  };

  handleSectionToggle = ({ id }) => {
    let next = update(`sections.${id}`, value => !value, this.state);
    this.setState(next);
  }

  handleExpandAll = (sections) => {
    let next = set('sections', sections, this.state);
    this.setState(next);
  }

  render() {
    let { model, fetchPackageTitles, intl } = this.props;
    let { router, queryParams } = this.context;
    let {
      showSelectionModal,
      packageSelected,
      packageAllowedToAddTitles,
      isCoverageEditable,
      sections
    } = this.state;

    let visibilityMessage = model.visibilityData.reason && `(${model.visibilityData.reason})`;

    let modalMessage = model.isCustom ?
      {
        header: intl.formatMessage({ id: 'ui-eholdings.package.modal.header.isCustom' }),
        body: intl.formatMessage({ id: 'ui-eholdings.package.modal.body.isCustom' }),
        buttonConfirm: intl.formatMessage({ id: 'ui-eholdings.package.modal.buttonConfirm.isCustom' }),
        buttonCancel: intl.formatMessage({ id: 'ui-eholdings.package.modal.buttonCancel.isCustom' })
      } :
      {
        header: intl.formatMessage({ id: 'ui-eholdings.package.modal.header' }),
        body: intl.formatMessage({ id: 'ui-eholdings.package.modal.body' }),
        buttonConfirm: intl.formatMessage({ id: 'ui-eholdings.package.modal.buttonConfirm' }),
        buttonCancel: intl.formatMessage({ id: 'ui-eholdings.package.modal.buttonCancel' })
      };

    let actionMenuItems = [
      {
        label: <FormattedMessage id="ui-eholdings.actionMenu.edit" />,
        to: {
          pathname: `/eholdings/packages/${model.id}/edit`,
          search: router.route.location.search,
          state: { eholdings: true }
        }
      }
    ];

    if (queryParams.searchType) {
      actionMenuItems.push({
        label: <FormattedMessage id="ui-eholdings.actionMenu.fullView" />,
        to: {
          pathname: `/eholdings/packages/${model.id}`,
          state: { eholdings: true }
        },
        className: styles['full-view-link']
      });
    }

    if (packageSelected) {
      let messageId = model.isCustom ? 'deletePackage' : 'removeFromHoldings';
      actionMenuItems.push({
        'label': intl.formatMessage({ id: `ui-eholdings.package.${messageId}` }),
        'state': { eholdings: true },
        'data-test-eholdings-package-remove-from-holdings-action': true,
        'onClick': this.handleSelectionToggle
      });
    }
    if (!packageSelected || model.isPartiallySelected) {
      let messageId = model.isPartiallySelected ? 'addAllToHoldings' : 'addToHoldings';
      actionMenuItems.push({
        'label': intl.formatMessage({ id: `ui-eholdings.${messageId}` }),
        'state': { eholdings: true },
        'data-test-eholdings-package-add-to-holdings-action': true,
        'onClick': this.props.addPackageToHoldings
      });
    }

    let toasts = processErrors(model);

    // if coming from creating a new custom package, show a success toast
    if (router.history.action === 'REPLACE' &&
        router.history.location.state &&
        router.history.location.state.isNewRecord) {
      toasts.push({
        id: `success-package-creation-${model.id}`,
        message: intl.formatMessage({ id: 'ui-eholdings.package.toast.isNewRecord' }),
        type: 'success'
      });
    }

    // if coming from destroying a custom or managed title
    // from within custom-package, show a success toast
    if (router.history.action === 'REPLACE' &&
        router.history.location.state &&
        router.history.location.state.isDestroyed) {
      toasts.push({
        id: `success-resource-destruction-${model.id}`,
        message: intl.formatMessage({ id: 'ui-eholdings.package.toast.isDestroyed' }),
        type: 'success'
      });
    }

    // if coming from saving edits to the package, show a success toast
    if (router.history.action === 'PUSH' &&
        router.history.location.state &&
        router.history.location.state.isFreshlySaved) {
      toasts.push({
        id: `success-package-saved-${model.id}`,
        message: intl.formatMessage({ id: 'ui-eholdings.package.toast.isFreshlySaved' }),
        type: 'success'
      });
    }

    return (
      <div>
        <Toaster toasts={toasts} position="bottom" />
        <DetailsView
          type="package"
          model={model}
          key={model.id}
          paneTitle={model.name}
          actionMenuItems={actionMenuItems}
          sections={sections}
          handleExpandAll={this.handleExpandAll}
          lastMenu={(
            <IconButton
              data-test-eholdings-package-edit-link
              icon="edit"
              ariaLabel={`Edit ${model.name}`}
              to={{
                pathname: `/eholdings/packages/${model.id}/edit`,
                search: router.route.location.search,
                state: { eholdings: true }
              }}
            />
          )}
          bodyContent={(
            <div>
              <Accordion
                label={intl.formatMessage({ id: 'ui-eholdings.label.holdingStatus' })}
                open={sections.packageShowHoldingStatus}
                id="packageShowHoldingStatus"
                onToggle={this.handleSectionToggle}
              >
                <SelectionStatus
                  model={model}
                  onAddToHoldings={this.props.addPackageToHoldings}
                />
              </Accordion>
              <Accordion
                label={intl.formatMessage({ id: 'ui-eholdings.label.packageInformation' })}
                open={sections.packageShowInformation}
                id="packageShowInformation"
                onToggle={this.handleSectionToggle}
              >
                <KeyValue label={<FormattedMessage id="ui-eholdings.package.provider" />}>
                  <div data-test-eholdings-package-details-provider>
                    <Link to={`/eholdings/providers/${model.providerId}`}>{model.providerName}</Link>
                  </div>
                </KeyValue>

                {model.contentType && (
                  <KeyValue label={<FormattedMessage id="ui-eholdings.package.contentType" />}>
                    <div data-test-eholdings-package-details-content-type>
                      {model.contentType}
                    </div>
                  </KeyValue>
                )}

                {model.packageType && (
                  <KeyValue label={<FormattedMessage id="ui-eholdings.package.packageType" />}>
                    <div data-test-eholdings-package-details-type>
                      {model.packageType}
                    </div>
                  </KeyValue>
                )}

                <KeyValue label={<FormattedMessage id="ui-eholdings.package.titlesSelected" />}>
                  <div data-test-eholdings-package-details-titles-selected>
                    <FormattedNumber value={model.selectedCount} />
                  </div>
                </KeyValue>

                <KeyValue label={<FormattedMessage id="ui-eholdings.package.totalTitles" />}>
                  <div data-test-eholdings-package-details-titles-total>
                    <FormattedNumber value={model.titleCount} />
                  </div>
                </KeyValue>
              </Accordion>
              <Accordion
                label={intl.formatMessage({ id: 'ui-eholdings.package.packageSettings' })}
                open={sections.packageShowSettings}
                id="packageShowSettings"
                onToggle={this.handleSectionToggle}
              >
                {packageSelected ? (
                  <div>
                    <KeyValue label={<FormattedMessage id="ui-eholdings.package.visibility" />}>
                      <div data-test-eholdings-package-details-visibility-status>
                        {!model.visibilityData.isHidden ?
                          (<FormattedMessage id="ui-eholdings.yes" />)
                            :
                          `No ${visibilityMessage}`}
                      </div>

                      {model.visibilityData.isHidden && (
                        <div data-test-eholdings-package-details-is-hidden>
                          {model.visibilityData.reason}
                        </div>
                      )}
                    </KeyValue>
                    {!model.isCustom && (
                      <KeyValue label={<FormattedMessage id="ui-eholdings.package.packageAllowToAddTitles" />}>
                        <div>
                          {packageAllowedToAddTitles != null ? (
                            <div data-test-eholdings-package-details-allow-add-new-titles>
                              {packageAllowedToAddTitles ?
                                (<FormattedMessage id="ui-eholdings.yes" />)
                                :
                                (<FormattedMessage id="ui-eholdings.no" />)
                              }
                            </div>
                            ) : (
                              <div>
                                <Icon icon="spinner-ellipsis" />
                              </div>
                            )}
                        </div>
                      </KeyValue>
                    )}
                  </div>
                ) : (
                  <p><FormattedMessage id="ui-eholdings.package.visibility.notSelected" /></p>
                )}
              </Accordion>
              <Accordion
                label={intl.formatMessage({ id: 'ui-eholdings.package.coverageSettings' })}
                closedByDefault={!packageSelected}
                open={sections.packageShowCoverageSettings}
                id="packageShowCoverageSettings"
                onToggle={this.handleSectionToggle}
              >
                {packageSelected ? (
                  <div>
                    {model.customCoverage.beginCoverage ? (
                      <div>
                        <KeyValue label={<FormattedMessage id="ui-eholdings.package.customCoverageDates" />}>
                          <div data-test-eholdings-package-details-custom-coverage-display>
                            <FormattedDate
                              value={model.customCoverage.beginCoverage}
                              timeZone="UTC"
                              year="numeric"
                              month="numeric"
                              day="numeric"
                            />&nbsp;-&nbsp;
                            {(model.customCoverage.endCoverage) ? (
                              <FormattedDate
                                value={model.customCoverage.endCoverage}
                                timeZone="UTC"
                                year="numeric"
                                month="numeric"
                                day="numeric"
                              />
                            ) : 'Present'}
                          </div>
                        </KeyValue>
                      </div>
                    ) : (
                      <p><FormattedMessage id="ui-eholdings.package.customCoverage.notSet" /></p>
                    )}
                  </div>
                ) : (
                  <p><FormattedMessage id="ui-eholdings.package.customCoverage.notSelected" /></p>
                )}
              </Accordion>
            </div>
          )}
          listType="titles"
          renderList={scrollable => (
            <QueryList
              type="package-titles"
              fetch={fetchPackageTitles}
              collection={model.resources}
              length={model.titleCount}
              scrollable={scrollable}
              itemHeight={70}
              renderItem={item => (
                <TitleListItem
                  item={item.content}
                  link={item.content && `/eholdings/resources/${item.content.id}`}
                  showSelected
                  headingLevel='h4'
                />
              )}
            />
          )}
        />

        <Modal
          open={showSelectionModal}
          size="small"
          label={modalMessage.header}
          id="eholdings-package-confirmation-modal"
          footer={(
            <ModalFooter
              primaryButton={{
                'label': modalMessage.buttonConfirm,
                'onClick': this.commitSelectionToggle,
                'data-test-eholdings-package-deselection-confirmation-modal-yes': true
              }}
              secondaryButton={{
                'label': modalMessage.buttonCancel,
                'onClick': this.cancelSelectionToggle,
                'data-test-eholdings-package-deselection-confirmation-modal-no': true
              }}
            />
          )}
        >
          {modalMessage.body}
        </Modal>

        <NavigationModal when={isCoverageEditable} />
      </div>
    );
  }
}

export default injectIntl(PackageShow);
