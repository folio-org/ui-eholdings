import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import capitalize from 'lodash/capitalize';

import {
  Icon,
  IconButton,
  PaneHeader,
  PaneMenu
} from '@folio/stripes-components';
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
    lastMenu: PropTypes.node
  };

  static contextTypes = {
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    isSticky: false
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleLayout);
    this.handleLayout();
  }

  componentDidUpdate() {
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
      lastMenu
    } = this.props;

    let {
      router,
      queryParams
    } = this.context;

    let {
      isSticky
    } = this.state;

    let containerClassName = cx('container', {
      locked: isSticky
    });

    let historyState = router.history.location.state;

    return (
      <div data-test-eholdings-details-view={type}>
        <PaneHeader
          firstMenu={queryParams.searchType ? (
            <PaneMenu>
              <div data-test-eholdings-details-view-close-button>
                <IconButton
                  icon="closeX"
                  title={`Close ${paneTitle}`}
                  href={`/eholdings${router.route.location.search}`}
                />
              </div>
            </PaneMenu>
          ) : historyState && historyState.eholdings && (
            <PaneMenu>
              <div data-test-eholdings-details-view-back-button>
                <IconButton
                  icon="left-arrow"
                  title="Go back"
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
              <h2 data-test-eholdings-details-view-name={type}>
                {paneTitle}
              </h2>
              {paneSub &&
                <p>{paneSub}</p>
              }
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
                <h3>
                  {capitalize(listType)}
                </h3>
              </div>

              <div ref={(n) => { this.$list = n; }} className={styles.list}>
                {renderList(isSticky)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
