import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@folio/stripes-components/lib/IconButton';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Button from '@folio/stripes-components/lib/Button';
import Layout from '@folio/stripes-components/lib/Layout';

import DetailsView from './details-view';
import QueryList from './query-list';
import Link from './link';
import KeyValueLabel from './key-value-label';
import TitleListItem from './title-list-item';
import ToggleSwitch from './toggle-switch';
import Modal from './modal';
import PackageCustomCoverage from './package-custom-coverage';
import styles from './styles.css';

export default class PackageShow extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    fetchPackageTitles: PropTypes.func.isRequired,
    toggleSelected: PropTypes.func.isRequired,
    toggleHidden: PropTypes.func.isRequired,
    customCoverageSubmitted: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object,
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    packageSelected: this.props.model.isSelected,
    packageHidden: this.props.model.visibilityData.isHidden
  };

  componentWillReceiveProps({ model }) {
    if (!model.isSaving) {
      this.setState({
        packageSelected: model.isSelected,
        packageHidden: model.visibilityData.isHidden
      });
    }
  }

  handleSelectionToggle = () => {
    this.setState({ packageSelected: !this.props.model.isSelected });
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
      packageSelected: this.props.model.isSelected
    });
  };

  render() {
    let { model, fetchPackageTitles, customCoverageSubmitted } = this.props;
    let { intl, router, queryParams } = this.context;
    let { showSelectionModal, packageSelected, packageHidden } = this.state;
    let historyState = router.history.location.state;

    return (
      <div>
        <DetailsView
          type="package"
          model={model}
          showPaneHeader={!queryParams.searchType}
          paneHeaderFirstMenu={historyState && historyState.eholdings && (
            <PaneMenu>
              <div data-test-eholdings-package-details-back-button>
                <IconButton icon="left-arrow" onClick={() => router.history.goBack()} />
              </div>
            </PaneMenu>
          )}
          bodyContent={(
            <div>
              <KeyValueLabel label="Provider">
                <div data-test-eholdings-package-details-provider>
                  <Link to={`/eholdings/providers/${model.providerId}`}>{model.providerName}</Link>
                </div>
              </KeyValueLabel>

              {model.contentType && (
                <KeyValueLabel label="Content Type">
                  <div data-test-eholdings-package-details-content-type>
                    {model.contentType}
                  </div>
                </KeyValueLabel>
              )}

              <KeyValueLabel label="Titles Selected">
                <div data-test-eholdings-package-details-titles-selected>
                  {intl.formatNumber(model.selectedCount)}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Total Titles">
                <div data-test-eholdings-package-details-titles-total>
                  {intl.formatNumber(model.titleCount)}
                </div>
              </KeyValueLabel>

              <label
                data-test-eholdings-package-details-selected
                htmlFor="package-details-toggle-switch"
              >
                <h4>{packageSelected ? 'Selected' : 'Not Selected'}</h4>
                <ToggleSwitch
                  onChange={this.handleSelectionToggle}
                  checked={packageSelected}
                  isPending={model.update.isPending && 'isSelected' in model.update.changedAttributes}
                  id="package-details-toggle-switch"
                />
              </label>

              {packageSelected && (
                <div>
                  <hr />

                  <label
                    data-test-eholdings-package-details-hidden
                    htmlFor="package-details-toggle-hidden-switch"
                  >
                    <h4>
                      {model.visibilityData.isHidden
                        ? 'Hidden from patrons'
                        : 'Visible to patrons'}
                    </h4>

                    <Layout className="flex">
                      <div className={styles.marginRightHalf}>
                        <ToggleSwitch
                          onChange={this.props.toggleHidden}
                          checked={!packageHidden}
                          isPending={model.update.isPending &&
                            ('visibilityData' in model.update.changedAttributes)}
                          id="package-details-toggle-hidden-switch"
                        />
                      </div>

                      {model.visibilityData.isHidden && (
                        <div data-test-eholdings-package-details-is-hidden>
                          {model.visibilityData.reason}
                        </div>
                      )}
                    </Layout>
                  </label>

                  <hr />

                  <KeyValueLabel label="Custom Coverage">
                    <div data-test-eholdings-package-details-custom-coverage>
                      <PackageCustomCoverage
                        initialValues={model.customCoverage}
                        onSubmit={customCoverageSubmitted}
                        isPending={model.update.isPending && 'customCoverage' in model.update.changedAttributes}
                      />
                    </div>
                  </KeyValueLabel>
                </div>
              )}

              <hr />
            </div>
          )}
          listHeader="Titles"
          renderList={scrollable => (
            <QueryList
              type="package-titles"
              fetch={fetchPackageTitles}
              collection={model.customerResources}
              length={model.titleCount}
              scrollable={scrollable}
              itemHeight={70}
              renderItem={item => (
                <TitleListItem
                  item={item.content}
                  link={item.content && `/eholdings/customer-resources/${item.content.id}`}
                  showSelected
                />
              )}
            />
          )}
        />

        <Modal
          open={showSelectionModal}
          size="small"
          label="Remove package from holdings?"
          scope="root"
          footer={(
            <div>
              <Button
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
                data-test-eholdings-package-deselection-confirmation-modal-yes
              >
                Yes, remove
              </Button>
              <Button
                onClick={this.cancelSelectionToggle}
                data-test-eholdings-package-deselection-confirmation-modal-no
              >
                No, do not remove
              </Button>
            </div>
          )}
        >
          Are you sure you want to remove this package and all its titles from your holdings? All customizations will be lost.
        </Modal>
      </div>
    );
  }
}
