import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import capitalize from 'lodash/capitalize';

import PaneHeader from '@folio/stripes-components/lib/PaneHeader';
import Icon from '@folio/stripes-components/lib/Icon';

import KeyValueLabel from '../key-value-label';
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
    showPaneHeader: PropTypes.bool,
    paneHeaderFirstMenu: PropTypes.node,
    bodyContent: PropTypes.node.isRequired,
    listHeader: PropTypes.string,
    renderList: PropTypes.func
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
      showPaneHeader,
      paneHeaderFirstMenu,
      bodyContent,
      listHeader,
      renderList
    } = this.props;
    let {
      isSticky
    } = this.state;

    let containerClassName = cx('container', {
      locked: isSticky
    });

    return (
      <div>
        {showPaneHeader && (
          <PaneHeader firstMenu={paneHeaderFirstMenu} />
        )}

        <div
          ref={(n) => { this.$container = n; }}
          className={containerClassName}
          onScroll={this.handleScroll}
          onWheel={this.handleWheel}
          data-test-eholdings-details-view={type}
        >
          {model.isLoaded ? [
            <div key="header" className={styles.header}>
              <KeyValueLabel label={capitalize(type)}>
                <h1 data-test-eholdings-details-view-name={type}>
                  {model.name}
                </h1>
              </KeyValueLabel>
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
              <h3>{listHeader}</h3>

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
