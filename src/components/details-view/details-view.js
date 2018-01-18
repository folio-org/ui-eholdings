import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import capitalize from 'lodash/capitalize';

import PaneHeader from '@folio/stripes-components/lib/PaneHeader';
import Icon from '@folio/stripes-components/lib/Icon';

import KeyValueLabel from '../key-value-label';
import styles from './details-view.css';

const cx = classNames.bind(styles);

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
    this.setStickyHeight();
  }

  componentDidUpdate() {
    this.setStickyHeight();
  }

  setStickyHeight() {
    if (this.$container && this.$sticky) {
      this.$sticky.style.height = `${this.$container.offsetHeight}px`;
    }
  }

  handleScroll = (e) => {
    let { isSticky } = this.state;
    let scrollingList = this.$list.firstElementChild === e.target;

    // if the list element hits the top, disable isSticky
    if (scrollingList && e.target.scrollTop === 0 && isSticky) {
      this.setState({ isSticky: false });

    // don't do these calculations when not scrolling the container
    } else {
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

  handleWheel = (e) => {
    let { isSticky } = this.state;
    let scrollingUp = e.deltaY < 0;
    let notInList = !this.$list.contains(e.target);

    if (isSticky && scrollingUp && notInList) {
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
            <div ref={(n) => { this.$sticky = n; }} className={styles.sticky}>
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
