import { Component } from 'react';
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
} from '@folio/stripes/core';

import {
  Accordion,
  Button,
  Headline,
  KeyValue,
  Modal,
  ModalFooter,
  Row,
  Col,
  expandAllFunction,
} from '@folio/stripes/components';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';


import { processErrors } from '../../utilities';
import {
  listTypes,
  entityTypes,
  costPerUse as costPerUseShape,
  DOMAIN_NAME,
  paths,
  RECORDS_EDIT_PERMISSION,
} from '../../../constants';
import DetailsView from '../../details-view';
import ScrollView from '../../scroll-view';
import SearchPackageListItem from '../../search-package-list-item';
import IdentifiersList from '../../identifiers-list';
import ContributorsList from '../../contributors-list';
import AddTitleToPackage from '../_field-groups/add-title-to-package';
import Toaster from '../../toaster';
import PackageFilterModal from './package-filter-modal';
import UsageConsolidationAccordion from '../../../features/usage-consolidation-accordion';
import QueryNotFound from '../../query-search-list/not-found';
import KeyShortcutsWrapper from '../../key-shortcuts-wrapper';

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
    onPackageFilter: PropTypes.func.isRequired,
    request: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      showCustomPackageModal: false,
      sections: {
        titleShowTags: true,
        titleShowTitleInformation: true,
        titleShowPackages: true,
        titleShowUsageConsolidation: false,
        titleShowNotes: true,
      },
      filteredPackages: [],
      countOfAppliedPackagesFilters: 0,
      packageFilterApplied: false,
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

  hasEditPermission = () => {
    const {
      model,
      stripes,
    } = this.props;

    const hasEditPerm = stripes.hasPerm(RECORDS_EDIT_PERMISSION);

    return !!(model.isTitleCustom && hasEditPerm);
  };

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

  handlePackageFilterChange = (selectedPackages, countOfAppliedPackagesFilters) => {
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
      countOfAppliedPackagesFilters,
      packageFilterApplied: !!countOfAppliedPackagesFilters,
    });
    history.replace({ search: newSearch }, { eholdings: true });
  }

  get lastMenu() {
    const {
      onEdit,
    } = this.props;

    if (!this.hasEditPermission()) return null;

    return (
      <Button
        data-test-eholdings-title-edit-link
        buttonStyle="primary"
        onClick={onEdit}
        marginBottom0
      >
        <FormattedMessage id="ui-eholdings.actionMenu.edit" />
      </Button>
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

  toggleAllSections = (expand) => {
    this.setState((curState) => {
      const sections = expandAllFunction(curState.sections, expand);
      return { sections };
    });
  };

  render() {
    const {
      model,
      addCustomPackage,
      request,
      fetchTitleCostPerUse,
      costPerUse,
      intl,
      customPackages,
      onPackageFilter,
    } = this.props;
    const {
      showCustomPackageModal,
      sections,
      filteredPackages,
      countOfAppliedPackagesFilters,
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
      <KeyShortcutsWrapper
        toggleAllSections={this.toggleAllSections}
        onEdit={this.props.onEdit}
        ifPermission={this.hasEditPermission()}
      >
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
              filterCount={countOfAppliedPackagesFilters}
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
                <Row>
                  <Col
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <ContributorsList data={model.contributors} />

                    {model.edition && (
                      <KeyValue
                        label={<FormattedMessage id="ui-eholdings.title.edition" />}
                        data-test-eholdings-title-show-edition
                      >
                        {model.edition}
                      </KeyValue>
                    )}

                    {model.publisherName && (
                      <KeyValue
                        label={<FormattedMessage id="ui-eholdings.title.publisherName" />}
                        data-test-eholdings-title-show-publisher-name
                      >
                        {model.publisherName}
                      </KeyValue>
                    )}

                    {model.publicationType && (
                      <KeyValue
                        label={<FormattedMessage id="ui-eholdings.title.publicationType" />}
                        data-test-eholdings-title-show-publication-type
                      >
                        {model.publicationType}
                      </KeyValue>
                    )}

                    <IdentifiersList data={model.identifiers} />
                  </Col>
                  <Col
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    {model.subjects.length > 0 && (
                      <KeyValue
                        label={<FormattedMessage id="ui-eholdings.title.subjects" />}
                        data-test-eholdings-title-show-subjects-list
                      >
                        {model.subjects.map(subjectObj => subjectObj.subject).join('; ')}
                      </KeyValue>
                    )}

                    <KeyValue
                      label={<FormattedMessage id="ui-eholdings.title.peerReviewed" />}
                      data-test-eholdings-peer-reviewed-field
                    >
                      {model.isPeerReviewed
                        ? (<FormattedMessage id="ui-eholdings.yes" />)
                        : (<FormattedMessage id="ui-eholdings.no" />)}
                    </KeyValue>

                    <KeyValue
                      label={<FormattedMessage id="ui-eholdings.title.titleType" />}
                      data-test-eholdings-title-details-type
                    >
                      {model.isTitleCustom ? (<FormattedMessage id="ui-eholdings.custom" />) : (<FormattedMessage id="ui-eholdings.managed" />)}
                    </KeyValue>

                    {model.description && (
                      <KeyValue
                        label={<FormattedMessage id="ui-eholdings.title.description" />}
                        data-test-eholdings-description-field
                      >
                        {model.description}
                      </KeyValue>
                    )}
                  </Col>
                </Row>
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
                entityType={entityTypes.TITLE}
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
          renderList={scrollable => {
            const items = packageFilterApplied
              ? filteredPackages
              : model.resources;

            if (!items.length) {
              return (
                <QueryNotFound type="package-titles">
                  <FormattedMessage id="ui-eholdings.notFound" />
                </QueryNotFound>
              );
            }

            return (
              <ScrollView
                itemHeight={ITEM_HEIGHT}
                items={items}
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
            );
          }}
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
                <AddTitleToPackage
                  packageOptions={this.customPackageOptions}
                  onPackageFilter={onPackageFilter}
                  loadingOptions={customPackages.isLoading}
                />
              );
            }}
          />
        </Modal>
      </KeyShortcutsWrapper>
    );
  }
}

export default withRouter(withStripes(injectIntl(TitleShow)));
