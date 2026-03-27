import { useRef, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames/bind';
import noop from 'lodash/noop';

import {
  Accordion,
  ExpandAllButton,
  Headline,
  Icon,
  IconButton,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import { useColumnManager } from '@folio/stripes/smart-components';

import { withHistoryBack } from '../../hooks';
import AccordionListHeader from '../accordion-list-header';
import { PACKAGE_TITLE_LIST_COLUMN_MAPPING } from '../../constants/package-titles-list-columns';

import styles from './details-view.css';

const cx = classNames.bind(styles);

const propTypes = {
  accordionHeaderLoading: PropTypes.bool,
  actionMenu: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
  ariaRole: PropTypes.string,
  bodyAriaRole: PropTypes.string,
  bodyContent: PropTypes.node.isRequired,
  footer: PropTypes.node,
  goBack: PropTypes.func.isRequired,
  handleExpandAll: PropTypes.func,
  history: ReactRouterPropTypes.history.isRequired,
  lastMenu: PropTypes.node,
  listSectionId: PropTypes.string,
  listType: PropTypes.node,
  location: PropTypes.object.isRequired,
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
  renderAccordionHeaderSearch: PropTypes.func,
  renderList: PropTypes.func,
  resultsLength: PropTypes.number,
  sections: PropTypes.object,
  type: PropTypes.string.isRequired,
};

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
const DetailsView = ({
  renderAccordionHeaderSearch = noop,
  ...props
}) => {
  const {
    type,
    model,
    paneTitle,
    actionMenu,
    lastMenu,
    footer,
  } = props;

  // used to focus the heading when the model loads
  const $heading = useRef(null);

  useEffect(() => {
    // if the heading exists on mount, focus it
    if ($heading.current) {
      // TODO: fix safari auto-scrolling to this focused element when
      // it is off-screen during the pane enter animation
      $heading.current.focus();
    }
  }, []);

  useEffect(() => {
    // if the model just finished loading focus the heading
    if (props.model.isLoaded) {
      $heading.current.focus();
    }
  }, [props.model.isLoaded]);

  const { visibleColumns, toggleColumn } = useColumnManager(`eholdings-${props.type}`, PACKAGE_TITLE_LIST_COLUMN_MAPPING);

  const accordionHeaderSearch = useMemo(() => renderAccordionHeaderSearch({
    visibleColumns,
    toggleColumn,
  }), [renderAccordionHeaderSearch, visibleColumns, toggleColumn]);

  const navigateBack = () => {
    props.goBack();
  };

  const renderAccordionHeader = useCallback((accordionHeaderProps) => (
    <AccordionListHeader
      {...accordionHeaderProps}
    />
  ), []);

  const renderFirstMenu = () => {
    const { onCancel } = props;

    return (
      <FormattedMessage
        id="ui-eholdings.label.icon.closeX"
        values={{ paneTitle }}
      >
        {([ariaLabel]) => (
          <IconButton
            icon="times"
            ariaLabel={ariaLabel}
            onClick={onCancel || navigateBack}
            data-test-eholdings-details-view-back-button
            data-testid="close-details-view-button"
          />
        )}
      </FormattedMessage>
    );
  };

  const renderItemData = () => {
    const {
      bodyContent,
      listType,
      renderList,
      paneSub,
      resultsLength,
      sections,
      handleExpandAll,
      listSectionId,
      onListToggle,
      ariaRole,
      bodyAriaRole,
    } = props;

    const isListAccordionOpen = sections && sections[listSectionId];

    return (
      <>
        <div key="header" className={styles.header}>
          <Headline
            size="x-large"
            tag="h2"
            margin="none"
            tabIndex={-1}
            ref={$heading}
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
              className={styles.sticky}
              data-test-eholdings-details-view-list={type}
            >
              <Accordion
                header={renderAccordionHeader}
                headerProps={{
                  resultsLength,
                }}
                label={(
                  <Headline
                    size="large"
                    tag="h3"
                  >
                    <FormattedMessage id={`ui-eholdings.listType.${listType}`} />
                  </Headline>
                )}
                displayWhenOpen={accordionHeaderSearch}
                open={isListAccordionOpen}
                id={listSectionId}
                onToggle={onListToggle}
                listType={listType}
              >
                {isListAccordionOpen && renderList({ visibleColumns })}
              </Accordion>
            </div>
          )}
        </div>
      </>
    );
  };

  const indicateItemIsNotLoaded = () => {
    const { model: { request } } = props;

    return request.isRejected
      ? (
        <p data-test-eholdings-details-view-error={type}>
          {request.errors[0].title}
        </p>
      )
      : <Icon icon="spinner-ellipsis" />;
  };

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
          firstMenu={renderFirstMenu()}
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
            className={containerClassName}
            data-test-eholdings-detail-pane-contents
            data-testid="scroll-container"
          >
            {model.isLoaded
              ? renderItemData()
              : indicateItemIsNotLoaded()
            }
          </div>
        </Pane>
      </Paneset>
    </div>
  );
};

DetailsView.propTypes = propTypes;

export default withHistoryBack(DetailsView);
