import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';

import update from 'lodash/fp/update';
import set from 'lodash/fp/set';

import qs from 'qs';

import {
  withStripes,
  IfPermission,
} from '@folio/stripes-core';

import {
  Accordion,
  Button,
  Headline,
  KeyValue,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';

import { processErrors } from '../../utilities';
import {
  listTypes,
  entityTypes,
  DOMAIN_NAME,
  paths,
  costPerUse as costPerUseShape,
} from '../../../constants';
import DetailsView from '../../details-view';
import ScrollView from '../../scroll-view';
import SearchPackageListItem from '../../search-package-list-item';
import IdentifiersList from '../../identifiers-list';
import ContributorsList from '../../contributors-list';
import AddTitleToPackage from '../_field-groups/add-title-to-package';
import Toaster from '../../toaster';
import KeyValueColumns from '../../key-value-columns';
import PackageFilterModal from './package-filter-modal';
import UsageConsolidationAccordion from '../../../features/usage-consolidation-accordion';
import styles from './title-show.css';

const focusOnErrors = createFocusDecorator();
const ITEM_HEIGHT = 62;

class TitleShow extends Component {
  static propTypes = {
    addCustomPackage: PropTypes.func.isRequired,
    costPerUse: costPerUseShape.CostPerUseReduxStateShape.isRequired,
    customPackages: PropTypes.object.isRequired,
    fetchTitleCostPerUse: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    isFreshlySaved: PropTypes.bool,
    isNewRecord: PropTypes.bool,
    location: ReactRouterPropTypes.location.isRequired,
    model: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    request: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    const filteredPackages = this.getFilteredPackagesFromParams();

    this.state = {
      showCustomPackageModal: false,
      sections: {
        titleShowNotes: true,
        titleShowTags: true,
        titleShowTitleInformation: true,
        titleShowPackages: true,
        titleShowUsageConsolidation: false,
      },
      filteredPackages,
      packageFilterApplied: !!filteredPackages.length,
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.model.isLoaded && this.props.model.isLoaded) {
      const filteredPackages = this.getFilteredPackagesFromParams();

      this.setState({ // eslint-disable-line react/no-did-update-set-state
        filteredPackages,
        packageFilterApplied: !!filteredPackages.length,
      });
    }
  }

  getFilteredPackagesFromParams = () => {
    const {
      location,
      model,
    } = this.props;

    const { filteredPackages: filteredPackagesIds } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    return filteredPackagesIds
      ? model.resources.records.filter(({ id: recordId }) => filteredPackagesIds.some(id => id === recordId))
      : [];
  }

  handlePackageFilterChange = selectedPackages => {
    const {
      history,
      location,
    } = this.props;

    const filteredPackagesIds = selectedPackages.map(({ id }) => id);
    const currentSearch = qs.parse(location.search);
    const newSearch = qs.stringify({
      ...currentSearch,
      filteredPackages: filteredPackagesIds,
    }, { arrayFormat: 'indices' });

    this.setState({
      filteredPackages: selectedPackages,
      packageFilterApplied: !!selectedPackages.length,
    });
    history.replace({ search: newSearch }, { eholdings: true });
  }

  get lastMenu() {
    const {
      model,
      onEdit,
    } = this.props;

    if (!onEdit || !model.isTitleCustom) return null;

    return (
      <IfPermission perm="ui-eholdings.records.edit">
        <Button
          data-test-eholdings-title-edit-link
          buttonStyle="primary"
          onClick={onEdit}
          marginBottom0
        >
          <FormattedMessage id="ui-eholdings.actionMenu.edit" />
        </Button>
      </IfPermission>
    );
  }

  get toasts() {
    const { model, isFreshlySaved, isNewRecord } = this.props;
    const toasts = processErrors(model);

    // if coming from creating a new custom package, show a success toast
    if (isNewRecord) {
      toasts.push({
        id: `success-title-${model.id}`,
        message: <FormattedMessage id="ui-eholdings.title.toast.isNewRecord" />,
        type: 'success'
      });
    }

    // if coming from saving edits to the package, show a success toast
    if (isFreshlySaved) {
      toasts.push({
        id: `success-title-saved-${model.id}`,
        message: <FormattedMessage id="ui-eholdings.title.toast.isFreshlySaved" />,
        type: 'success'
      });
    }

    return toasts;
  }

  get customPackageOptions() {
    const titlePackageIds = this.props.model.resources.map(({ id }) => id);
    this.props.customPackages.pageSize = 100;

    return this.props.customPackages.map(pkg => ({
      disabled: titlePackageIds.includes(pkg.id),
      label: pkg.name,
      value: pkg.id
    }));
  }

  toggleCustomPackageModal = () => {
    this.setState(({ showCustomPackageModal }) => ({
      showCustomPackageModal: !showCustomPackageModal
    }));
  }

  handleSectionToggle = ({ id }) => {
    const next = update(`sections.${id}`, value => !value, this.state);
    this.setState(next);
  }

  handleExpandAll = (sections) => {
    const next = set('sections', sections, this.state);
    this.setState(next);
  }

  render() {
    const {
      model,
      addCustomPackage,
      request,
      fetchTitleCostPerUse,
      costPerUse,
      intl,
    } = this.props;
    const {
      showCustomPackageModal,
      sections,
      filteredPackages,
      packageFilterApplied,
    } = this.state;

    const modalMessage = {
      header: <FormattedMessage id="ui-eholdings.title.modalMessage.addTitleToCustomPackage" />,
      label: intl.formatMessage({ id: 'ui-eholdings.title.modalMessage.addTitleToCustomPackage' }),
      saving: <FormattedMessage id="ui-eholdings.saving" />,
      submit: <FormattedMessage id="ui-eholdings.submit" />,
      cancel: <FormattedMessage id="ui-eholdings.cancel" />
    };
    let submit;
    const submitAddToCustomPackage = (event) => submit(event);

    const showUsageConsolidation = model.hasSelectedResources;

    return (
      <>
        <Toaster toasts={this.toasts} position="bottom" />
        <DetailsView
          type="title"
          model={model}
          key={model.id}
          paneTitle={model.name}
          sections={sections}
          handleExpandAll={this.handleExpandAll}
          lastMenu={this.lastMenu}
          ariaRole="tablist"
          bodyAriaRole="tab"
          listSectionId="titleShowPackages"
          searchModal={(
            <PackageFilterModal
              allPackages={model.resources.records}
              selectedPackages={filteredPackages}
              onSubmit={this.handlePackageFilterChange}
              filterCount={packageFilterApplied ? 1 : 0} // todo: implement actual filter counting to avoid hardcoding
            />)
          }
          bodyContent={(
            <>
              <Accordion
                label={(
                  <Headline size="large" tag="h3">
                    <FormattedMessage id="ui-eholdings.title.titleInformation" />
                  </Headline>
                )}
                open={sections.titleShowTitleInformation}
                id="titleShowTitleInformation"
                onToggle={this.handleSectionToggle}
              >
                <KeyValueColumns>
                  <div>
                    <ContributorsList data={model.contributors} />

                    {model.edition && (
                      <KeyValue label={<FormattedMessage id="ui-eholdings.title.edition" />}>
                        <div data-test-eholdings-title-show-edition>
                          {model.edition}
                        </div>
                      </KeyValue>
                    )}

                    {model.publisherName && (
                      <KeyValue label={<FormattedMessage id="ui-eholdings.title.publisherName" />}>
                        <div data-test-eholdings-title-show-publisher-name>
                          {model.publisherName}
                        </div>
                      </KeyValue>
                    )}

                    {model.publicationType && (
                      <KeyValue label={<FormattedMessage id="ui-eholdings.title.publicationType" />}>
                        <div data-test-eholdings-title-show-publication-type>
                          {model.publicationType}
                        </div>
                      </KeyValue>
                    )}

                    <IdentifiersList data={model.identifiers} />

                  </div>
                  <div>

                    {model.subjects.length > 0 && (
                      <KeyValue label={<FormattedMessage id="ui-eholdings.title.subjects" />}>
                        <div data-test-eholdings-title-show-subjects-list>
                          {model.subjects.map(subjectObj => subjectObj.subject).join('; ')}
                        </div>
                      </KeyValue>
                    )}

                    <KeyValue label={<FormattedMessage id="ui-eholdings.title.peerReviewed" />}>
                      <div data-test-eholdings-peer-reviewed-field>
                        {model.isPeerReviewed
                          ? <FormattedMessage id="ui-eholdings.yes" />
                          : <FormattedMessage id="ui-eholdings.no" />
                        }
                      </div>
                    </KeyValue>

                    <KeyValue label={<FormattedMessage id="ui-eholdings.title.titleType" />}>
                      <div data-test-eholdings-title-details-type>
                        {model.isTitleCustom
                          ? <FormattedMessage id="ui-eholdings.custom" />
                          : <FormattedMessage id="ui-eholdings.managed" />
                        }
                      </div>
                    </KeyValue>

                    {model.description && (
                      <KeyValue label={<FormattedMessage id="ui-eholdings.title.description" />}>
                        <div data-test-eholdings-description-field>
                          {model.description}
                        </div>
                      </KeyValue>
                    )}
                  </div>
                </KeyValueColumns>

                <div className={styles['add-to-custom-package-button']}>
                  <Button
                    data-test-eholdings-add-to-custom-package-button
                    onClick={this.toggleCustomPackageModal}
                  >
                    <FormattedMessage id="ui-eholdings.title.addToCustomPackage" />
                  </Button>
                </div>
              </Accordion>

              <NotesSmartAccordion
                id="titleShowNotes"
                open={sections.titleShowNotes}
                onToggle={this.handleSectionToggle}
                domainName={DOMAIN_NAME}
                entityName={model.name}
                entityType={entityTypes.PACKAGE}
                entityId={model.id}
                pathToNoteCreate={paths.NOTE_CREATE}
                pathToNoteDetails={paths.NOTES}
              />

              {showUsageConsolidation && (
                <UsageConsolidationAccordion
                  id="titleShowUsageConsolidation"
                  isOpen={sections.titleShowUsageConsolidation}
                  onToggle={this.handleSectionToggle}
                  onFilterSubmit={fetchTitleCostPerUse}
                  recordType={entityTypes.TITLE}
                  costPerUseData={costPerUse}
                  publicationType={model.publicationType}
                />
              )}
            </>
          )}
          listType={listTypes.PACKAGES}
          onListToggle={this.handleSectionToggle}
          resultsLength={packageFilterApplied
            ? filteredPackages.length
            : model.resources.length}
          renderList={scrollable => (
            <ScrollView
              itemHeight={ITEM_HEIGHT}
              items={packageFilterApplied
                ? filteredPackages
                : model.resources}
              scrollable={scrollable}
              queryListName="title-packages"
            >
              {item => (
                <SearchPackageListItem
                  link={`/eholdings/resources/${item.id}`}
                  packageName={item.packageName}
                  item={item}
                  headingLevel='h4'
                />
              )}
            </ScrollView>
          )}
        />

        <Modal
          open={showCustomPackageModal}
          size="small"
          label={modalMessage.header}
          aria-label={modalMessage.label}
          id="eholdings-custom-package-modal"
          wrappingElement="form"
          enforceFocus={false}
          footer={(
            <ModalFooter>
              <Button
                data-test-eholdings-custom-package-modal-submit
                buttonStyle="primary"
                disabled={request.isPending}
                onClick={submitAddToCustomPackage}
              >
                {request.isPending ? modalMessage.saving : modalMessage.submit}
              </Button>
              <Button
                data-test-eholdings-custom-package-modal-cancel
                disabled={request.isPending}
                onClick={this.toggleCustomPackageModal}
              >
                <FormattedMessage id="ui-eholdings.cancel" />
              </Button>
            </ModalFooter>
          )}
        >
          <Form
            onSubmit={addCustomPackage}
            decorators={[focusOnErrors]}
            render={({ handleSubmit }) => {
              submit = handleSubmit;
              return (
                <form>
                  <AddTitleToPackage
                    packageOptions={this.customPackageOptions}
                  />
                </form>
              );
            }}
          />
        </Modal>

      </>
    );
  }
}

export default withRouter(withStripes(injectIntl(TitleShow)));
