import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import capitalize from 'lodash/capitalize';

import {
  Badge,
  Icon,
  IconButton,
  Modal,
  ModalFooter,
  PaneHeader,
  PaneMenu
} from '@folio/stripes-components';
import SearchForm from '../search-form';
import styles from './details-view.css';

const cx = classNames.bind(styles);

/**
 * This component will render a details view which includes the type
 * of resource and resource name, along with some body content, and an
 * optional list element. If given a `renderList` function, the list's
 * portion of the details page will become sticky on scroll if the
 * list's contents are longer than the containing element.
 *
 * It also includes a pane header component with an option for the
 * `firstMenu` prop. This is so we can reduce the boilerplate in the
 * various details views, which may or may not require their own
 * header component.
 */
export default class DetailsView extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    model: PropTypes.shape({
      name: PropTypes.string.isRequired,
      isLoaded: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      request: PropTypes.object.isRequired
    }).isRequired,
    paneTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]),
    paneSub: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]),
    bodyContent: PropTypes.node.isRequired,
    listType: PropTypes.string,
    renderList: PropTypes.func,
    actionMenuItems: PropTypes.array,
    lastMenu: PropTypes.node,
    enableListSearch: PropTypes.bool,
    onSearch: PropTypes.func,
    resultsLength: PropTypes.number,
    searchParams: PropTypes.object,
    onFilter: PropTypes.func
  };

  static contextTypes = {
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    isSticky: false,
    showSearchModal: false,
    showSearchModalSearchButton: true,
    searchParams: null
  };

  // used to focus the heading when the model loads
  $heading = React.createRef(); // eslint-disable-line react/sort-comp

  componentDidMount() {
    window.addEventListener('resize', this.handleLayout);
    this.handleLayout();

    // if the heading exists on mount, focus it
    if (this.$heading.current) {
      this.$heading.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    let { model } = this.props;

    // if the model just finished loading focus the heading
    if (!prevProps.model.isLoaded && model.isLoaded) {
      this.$heading.current.focus();
    }

    this.handleLayout();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleLayout);
  }

  /**
   * If the height of the sticky content is less than the container's
   * height, we have no need to handle any scroll behavior
   */
  handleLayout = () => {
    if (this.$container && this.$sticky && this.$list) {
      let stickyHeight = this.$sticky.offsetHeight;
      let containerHeight = this.$container.offsetHeight;

      this.shouldHandleScroll = stickyHeight >= containerHeight;

      // the sticky wrapper needs an explicit height for child
      // elements with percentage-based heights
      if (this.shouldHandleScroll) {
        this.$sticky.style.height = `${containerHeight}px`;
      } else {
        this.$sticky.style.height = '';
      }
    }
  };

  /**
   * While scrolling, we need to decide if we should enable or disable
   * the list's "sticky" behavior
   */
  handleScroll = (e) => {
    let { isSticky } = this.state;

    // bail if we shouldn't handle scrolling
    if (!this.shouldHandleScroll) return;

    // if the list's child element hits the top, disable isSticky
    if (this.$list.firstElementChild === e.target &&
        e.target.scrollTop === 0 && isSticky) {
      // prevent scroll logic around bottoming out by scrolling up 1px
      this.$container.scrollTop = this.$container.scrollTop - 1;
      this.setState({ isSticky: false });

    // don't do these calculations when not scrolling the container
    } else if (e.currentTarget === e.target) {
      let top = e.currentTarget.scrollTop;
      let height = e.currentTarget.offsetHeight;
      let scrollHeight = e.currentTarget.scrollHeight;
      // these will be equal when scrolled all the way down
      let bottomedOut = (top + height) === scrollHeight;

      // if bottoming out, enable isSticky
      if (bottomedOut && !isSticky) {
        this.setState({ isSticky: true });
      // if not bottomed out, disable isSticky
      } else if (!bottomedOut && isSticky) {
        this.setState({ isSticky: false });
      }
    }
  };

  /**
   * When scrolling the container is locked, we need to listen for a
   * mousewheel up to disable the sticky list. But only a mousewheel
   * up outside of the list, or when the inner list is scrolled all
   * the way up already.
   */
  handleWheel = (e) => {
    // this does not need to run if we do not have a list element
    if (!this.$list) return;

    let { isSticky } = this.state;
    let scrollingUp = e.deltaY < 0;
    let notInList = !this.$list.contains(e.target);
    let listAtTop = this.$list.firstElementChild.scrollTop === 0;

    if (isSticky && scrollingUp && (notInList || listAtTop)) {
      // prevent scroll logic around bottoming out by scrolling up 1px
      this.$container.scrollTop = this.$container.scrollTop - 1;
      this.setState({ isSticky: false });
    }
  };

  handleListSearch = (params) => {
    let { searchParams } = this.props;

    if (this.props.onSearch) {
      this.props.onSearch(params);
    }

    this.setState({
      showSearchModal: searchParams.q === params.q
    });
  }

  toggleSearchModal = () => {
    this.setState(({ showSearchModal }) => ({
      showSearchModal: !showSearchModal
    }));
  }

  updateSearch = () => {
    this.setState({
      showSearchModal: false,
    });

    if (this.props.onFilter) {
      this.props.onFilter(this.state.searchParams);
    }
  }

  resetSearch = () => {
    this.setState({
      searchParams: null,
      showSearchModal: false,
    });

    if (this.props.onFilter) {
      this.props.onFilter(this.state.searchParams);
    }
  }

  closeSearchModal = () => {
    this.setState({
      searchParams: null,
      showSearchModal: false,
      showSearchModalSearchButton: false
    });
  }

  handleFilterChange = searchParams => {
    this.setState({
      searchParams,
      showSearchModalSearchButton: true
    });
  }

  handleSearchQueryChange = q => {
    this.setState({
      searchParams: {
        ...(this.state.searchParams || this.props.searchParams),
        q
      },
      showSearchModalSearchButton: true
    });
  }

  render() {
    let {
      type,
      model,
      bodyContent,
      listType,
      renderList,
      paneTitle,
      paneSub,
      actionMenuItems,
      lastMenu,
      enableListSearch,
      resultsLength,
      searchParams = {}
    } = this.props;

    if (this.state.searchParams) {
      searchParams = this.state.searchParams;
    }

    let {
      router,
      queryParams
    } = this.context;

    let {
      isSticky,
      showSearchModal,
      showSearchModalSearchButton
    } = this.state;

    let containerClassName = cx('container', {
      locked: isSticky
    });

    let historyState = router.history.location.state;

    let filterCount = [searchParams.q]
      .concat(Object.values(searchParams.filter || {}))
      .filter(Boolean).length;

    return (
      <div data-test-eholdings-details-view={type}>
        <PaneHeader
          firstMenu={queryParams.searchType ? (
            <PaneMenu>
              <div data-test-eholdings-details-view-close-button>
                <IconButton
                  icon="closeX"
                  ariaLabel={`Close ${paneTitle}`}
                  href={`/eholdings${router.route.location.search}`}
                />
              </div>
            </PaneMenu>
          ) : historyState && historyState.eholdings && (
            <PaneMenu>
              <div data-test-eholdings-details-view-back-button>
                <IconButton
                  icon="left-arrow"
                  ariaLabel="Go back"
                  onClick={() => router.history.goBack()}
                />
              </div>
            </PaneMenu>
          )}
          paneTitle={(
            <span data-test-eholdings-details-view-pane-title>{paneTitle}</span>
          )}
          paneSub={(
            <span data-test-eholdings-details-view-pane-sub>{paneSub}</span>
          )}
          actionMenuItems={actionMenuItems}
          lastMenu={lastMenu}
        />

        <div
          ref={(n) => { this.$container = n; }}
          className={containerClassName}
          onScroll={this.handleScroll}
          onWheel={this.handleWheel}
          data-test-eholdings-detail-pane-contents
        >
          {model.isLoaded ? [
            <div key="header" className={styles.header}>
              <h2
                tabIndex={-1}
                ref={this.$heading}
                data-test-eholdings-details-view-name={type}
              >
                {paneTitle}
              </h2>
              {paneSub && (
                <p>{paneSub}</p>
              )}
            </div>,

            <div key="body" className={styles.body}>
              {bodyContent}
            </div>
          ] : model.request.isRejected ? (
            <p data-test-eholdings-details-view-error={type}>
              {model.request.errors[0].title}
            </p>
          ) : (
            <Icon icon="spinner-ellipsis" />
          )}

          {!!renderList && model.isLoaded && (
            <div
              ref={(n) => { this.$sticky = n; }}
              className={styles.sticky}
              data-test-eholdings-details-view-list={type}
            >
              <div className={styles['list-header']}>
                <div>
                  <h3>{capitalize(listType)}</h3>

                  {resultsLength > 0 && (
                    <div data-test-eholdings-details-view-results-count>
                      <p><small>{resultsLength} records found</small></p>
                    </div>
                  )}
                </div>

                {enableListSearch && (
                  <div className={styles['search-filter-area']}>
                    {filterCount > 0 && (
                      <div data-test-eholdings-details-view-filters>
                        <Badge className={styles['filter-count']}>{filterCount}</Badge>
                      </div>
                    )}
                    <div data-test-eholdings-details-view-search>
                      <IconButton icon="search" onClick={this.toggleSearchModal} />
                    </div>
                  </div>
                )}
              </div>

              <div ref={(n) => { this.$list = n; }} className={styles.list}>
                {renderList(isSticky)}
              </div>
            </div>
          )}
        </div>

        {enableListSearch && showSearchModal && (
          <Modal
            size="small"
            label={`Filter ${listType}`}
            open={showSearchModal}
            onClose={this.closeSearchModal}
            id="eholdings-details-view-search-modal"
            closeOnBackgroundClick
            dismissible
            footer={showSearchModalSearchButton && (
              <ModalFooter
                primaryButton={{
                  'label': 'Search',
                  'onClick': this.updateSearch,
                  'data-test-eholdings-modal-search-button': true
                }}
                secondaryButton={{
                  'label': 'Reset all',
                  'onClick': this.resetSearch,
                  'data-test-eholdings-modal-reset-all-button': true
                }}
              />
            )}
          >
            <SearchForm
              searchType={listType}
              searchString={searchParams.q}
              filter={searchParams.filter}
              searchField={searchParams.searchField}
              sort={searchParams.sort}
              onSearch={this.handleListSearch}
              displaySearchTypeSwitcher={false}
              displaySearchButton={false}
              onFilterChange={this.handleFilterChange}
              onSearchQueryChange={this.handleSearchQueryChange}
            />
          </Modal>
        )}
      </div>
    );
  }
}
