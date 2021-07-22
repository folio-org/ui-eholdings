import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IfPermission,
  AppIcon,
  useStripes,
} from '@folio/stripes/core';
import {
  Button,
  PaneMenu,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
} from '@folio/stripes/smart-components';

import KeyShortcutsWrapper from '../key-shortcuts-wrapper';
import {
  searchTypes,
  APP_ICON_NAME,
  TITLES_PACKAGES_CREATE_DELETE_PERMISSION,
} from '../../constants';

import styles from './search-paneset.css';

const propTypes = {
  filterCount: PropTypes.number,
  hideFilters: PropTypes.bool,
  history: ReactRouterPropTypes.history.isRequired,
  isLoading: PropTypes.bool.isRequired,
  resultPaneTitle: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Component) }),
  ]),
  resultsLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  resultsType: PropTypes.string.isRequired,
  resultsView: PropTypes.node,
  searchForm: PropTypes.node.isRequired,
  totalResults: PropTypes.number,
  updateFilters: PropTypes.func.isRequired,
};

const defaultProps = {
  filterCount: 0,
  hideFilters: false,
  totalResults: 0,
};

const SearchPaneset = ({
  filterCount,
  hideFilters,
  history,
  isLoading,
  resultPaneTitle,
  resultsLabel,
  resultsType,
  resultsView,
  searchForm,
  totalResults,
  updateFilters,
}) => {
  const stripes = useStripes();

  const isPackageOrTitle = resultsType !== searchTypes.PROVIDERS;

  const openCreateNewEntity = () => {
    const createDeletePermission = stripes.hasPerm(TITLES_PACKAGES_CREATE_DELETE_PERMISSION);

    if (isPackageOrTitle && createDeletePermission) {
      history.push({
        pathname: `/eholdings/${resultsType}/new`,
        state: { eholdings: true },
      });
    }
  };

  const toggleFilters = () => {
    updateFilters(filtersIsHidden => !filtersIsHidden);
  };

  const renderLastMenu = () => {
    if (isPackageOrTitle) {
      return (
        <IfPermission perm={TITLES_PACKAGES_CREATE_DELETE_PERMISSION}>
          <Button
            data-test-eholdings-search-new-button
            buttonStyle="primary"
            marginBottom0
            to={{
              pathname: `/eholdings/${resultsType}/new`,
              state: { eholdings: true },
            }}
          >
            <FormattedMessage id="ui-eholdings.search.addNew" />
          </Button>
        </IfPermission>
      );
    }

    return <PaneMenu />;
  };

  const getSearchResultsPaneFirstMenu = () => {
    return hideFilters
      ? (
        <PaneMenu>
          <ExpandFilterPaneButton
            onClick={toggleFilters}
            filterCount={filterCount}
          />
        </PaneMenu>
      )
      : null;
  };

  const renderPaneSub = () => {
    if (!isLoading) {
      return (
        <FormattedMessage
          id="ui-eholdings.resultCount"
          values={{
            count: totalResults,
          }}
        />
      );
    }

    return <FormattedMessage id="ui-eholdings.search.loading" />;
  };

  return (
    <KeyShortcutsWrapper openCreateNewEntity={openCreateNewEntity}>
      <Paneset>
        {!hideFilters &&
          <Pane
            id="search-pane"
            tagName="section"
            defaultWidth="320px"
            fluidContentWidth={false}
            paneTitle={<FormattedMessage id="ui-eholdings.search.searchAndFilter" />}
            lastMenu={(
              <PaneMenu>
                <CollapseFilterPaneButton onClick={toggleFilters} />
              </PaneMenu>
            )}
            data-test-eholdings-search-pane
            data-testid="data-test-eholdings-search-pane"
          >
            {searchForm}
          </Pane>
        }
        <Pane
          appIcon={<AppIcon app={APP_ICON_NAME} />}
          defaultWidth="fill"
          firstMenu={getSearchResultsPaneFirstMenu()}
          id="search-results"
          lastMenu={renderLastMenu()}
          paneSub={resultsView && renderPaneSub()}
          padContent={false}
          paneTitle={resultsLabel}
          paneTitleRef={resultPaneTitle}
          data-test-results-pane
        >
          {resultsView || (
            <div
              className={styles['pre-search-pane-content']}
              data-test-eholdings-pre-search-pane
            >
              <div className={styles['pre-search-pane-content-label']}>
                <p>
                  <FormattedMessage id="ui-eholdings.search.enterQuery" />
                </p>
              </div>
            </div>
          )}
        </Pane>
      </Paneset>
    </KeyShortcutsWrapper>
  );
};

SearchPaneset.propTypes = propTypes;
SearchPaneset.defaultProps = defaultProps;

export default SearchPaneset;
