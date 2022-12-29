import { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames/bind';

import {
  Accordion,
  ExpandAllButton,
  Headline,
  Icon,
  IconButton,
  Pane,
  Paneset,
} from '@folio/stripes/components';

import AccordionListHeader from '../accordion-list-header';
import styles from './details-view.css';

const cx = classNames.bind(styles);

/**
 * This component will render a details view which includes the type
 * of resource and resource name, along with some body content, and an
 * optional list element.
 *
 * It also includes a pane header component with an option for the
 * `firstMenu` prop. This is so we can reduce the boilerplate in the
 * various details views, which may or may not require their own
 * header component.
 */
class DetailsView extends Component {
  static propTypes = {
    accordionHeaderLoading: PropTypes.bool.isRequired,
    actionMenu: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
    ariaRole: PropTypes.string,
    bodyAriaRole: PropTypes.string,
    bodyContent: PropTypes.node.isRequired,
    footer: PropTypes.node,
    handleExpandAll: PropTypes.func,
    history: ReactRouterPropTypes.history.isRequired,
    lastMenu: PropTypes.node,
    listSectionId: PropTypes.string,
    listType: PropTypes.node,
    location: ReactRouterPropTypes.location.isRequired,
    model: PropTypes.shape({
      isLoaded: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired,
      request: PropTypes.object.isRequired,
    }).isRequired,
    onCancel: PropTypes.func,
    onListToggle: PropTypes.func,
    paneSub: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.node,
    ]),
    paneTitle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.node,
    ]).isRequired,
    renderList: PropTypes.func,
    resultsLength: PropTypes.number,
    searchModal: PropTypes.node,
    sections: PropTypes.object,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    searchModal: null,
  }

  // used to focus the heading when the model loads
  $heading = createRef(); // eslint-disable-line react/sort-comp

  componentDidMount() {
    // if the heading exists on mount, focus it
    if (this.$heading.current) {
      // TODO: fix safari auto-scrolling to this focused element when
      // it is off-screen during the pane enter animation
      this.$heading.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const { model } = this.props;

    // if the model just finished loading focus the heading
    if (!prevProps.model.isLoaded && model.isLoaded) {
      this.$heading.current.focus();
    }
  }

  navigateBack = () => {
    const {
      history,
      location,
    } = this.props;

    const previousEHoldingsLocationKnown = location.search.includes('searchType');

    if (location.state && location.state.eholdings) {
      history.goBack();
    } else if (previousEHoldingsLocationKnown) {
      history.push({
        pathname: '/eholdings',
        search: location.search,
      });
    } else {
      history.push({
        pathname: '/eholdings',
      });
    }
  };

  renderFirstMenu = () => {
    const {
      paneTitle,
      onCancel,
    } = this.props;

    return (
      <FormattedMessage
        id="ui-eholdings.label.icon.closeX"
        values={{ paneTitle }}
      >
        {([ariaLabel]) => (
          <IconButton
            icon="times"
            ariaLabel={ariaLabel}
            onClick={onCancel || this.navigateBack}
            data-test-eholdings-details-view-back-button
            data-testid="close-details-view-button"
          />
        )}
      </FormattedMessage>
    );
  }

  renderItemData() {
    const {
      type,
      bodyContent,
      listType,
      renderList,
      paneTitle,
      paneSub,
      resultsLength,
      searchModal,
      sections,
      handleExpandAll,
      listSectionId,
      onListToggle,
      ariaRole,
      bodyAriaRole,
      accordionHeaderLoading,
    } = this.props;

    const isListAccordionOpen = sections && sections[listSectionId];

    return (
      <>
        <div key="header" className={styles.header}>
          <Headline
            size="x-large"
            tag="h2"
            margin="none"
            tabIndex={-1}
            ref={this.$heading}
            data-test-eholdings-details-view-name={type}
            data-testid="details-view-name-heading"
          >
            {paneTitle}
          </Headline>
          {paneSub && (
            <Headline
              data-testid="details-view-panesub-headline"
              weight="regular"
              faded
              size="large"
              tag="div"
              margin="none"
            >
              {paneSub}
            </Headline>
          )}
          {sections && (
            <div data-test-eholdings-details-view-collapse-all-button>
              <ExpandAllButton
                accordionStatus={sections}
                onToggle={handleExpandAll}
                className={styles.expandAll}
              />
            </div>
          )}
        </div>
        <div role={ariaRole}>
          <div key="body" className={styles.body} role={bodyAriaRole}>
            {bodyContent}
          </div>
          {!!renderList && (
            <div
              ref={(n) => { this.$sticky = n; }}
              className={styles.sticky}
              data-test-eholdings-details-view-list={type}
            >
              <Accordion
                header={props => (
                  <AccordionListHeader
                    {...props}
                    isLoading={accordionHeaderLoading}
                  />
                )}
                headerProps={{
                  resultsLength,
                  'data-testid': `accordion-toggle-button-${listSectionId}`,
                }}
                label={(
                  <Headline
                    size="large"
                    tag="h3"
                  >
                    <FormattedMessage id={`ui-eholdings.listType.${listType}`} />
                  </Headline>
                )}
                displayWhenOpen={searchModal}
                contentRef={(n) => { this.$list = n; }}
                open={isListAccordionOpen}
                id={listSectionId}
                onToggle={onListToggle}
                listType={listType}
              >
                {isListAccordionOpen && renderList()}
              </Accordion>
            </div>
          )}
        </div>
      </>
    );
  }

  indicateItemIsNotLoaded() {
    const {
      type,
      model: { request },
    } = this.props;

    return request.isRejected
      ? (
        <p data-test-eholdings-details-view-error={type}>
          {request.errors[0].title}
        </p>
      )
      : <Icon icon="spinner-ellipsis" />;
  }

  render() {
    const {
      type,
      model,
      paneTitle,
      actionMenu,
      lastMenu,
      footer,
    } = this.props;

    const containerClassName = cx('container', { hasFooter: !!footer });

    const paneIdFromTitle = paneTitle.replace(/\s+/g, '-').toLowerCase();
    const paneTitleId = `details-view-pane-title ${paneIdFromTitle}`;

    return (
      <div
        data-test-eholdings-details-view={type}
        data-testid={`details-view-type-${type}`}
      >
        <Paneset>
          <Pane
            id={paneIdFromTitle}
            defaultWidth="fill"
            padContent={false}
            actionMenu={actionMenu}
            footer={footer}
            firstMenu={this.renderFirstMenu()}
            paneTitle={
              <span
                data-test-eholdings-details-view-pane-title
                data-testid="details-view-pane-title"
                id={paneTitleId}
              >
                {paneTitle}
              </span>
            }
            lastMenu={lastMenu}
            aria-labelledby={paneTitleId}
          >
            <div
              ref={(n) => { this.$container = n; }}
              className={containerClassName}
              data-test-eholdings-detail-pane-contents
              data-testid="scroll-container"
            >
              {model.isLoaded
                ? this.renderItemData()
                : this.indicateItemIsNotLoaded()
              }
            </div>
          </Pane>
        </Paneset>
      </div>
    );
  }
}

export default DetailsView;
