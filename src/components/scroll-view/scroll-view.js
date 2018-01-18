import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import debounce from 'lodash/debounce';

import styles from './scroll-view.css';
import List from '../list';

const cx = classNames.bind(styles);

export default class ScrollView extends Component {
  static propTypes = {
    items: PropTypes.shape({
      length: PropTypes.number.isRequired,
      slice: PropTypes.func.isRequired
    }).isRequired,
    offset: PropTypes.number,
    scrollable: PropTypes.bool,
    itemHeight: PropTypes.number.isRequired,
    onUpdate: PropTypes.func,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    offset: 0,
    scrollable: true
  };

  state = {
    offset: this.props.offset,
    visibleItems: 0
  };

  componentDidMount() {
    // update the DOM element's scrollTop position with our offset
    this.setScrollOffset();
    // adjust the amount of visible items on resize
    window.addEventListener('resize', this.handleListLayout);
    this.handleListLayout();
  }

  componentWillReceiveProps({ offset }) {
    // new offset that's different from the state
    if (offset !== this.props.offset && offset !== this.state.offset) {
      this.setState({ offset });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // did the state update
    if (prevState.offset !== this.state.offset) {
      // props are outdated, need to call onUpdate
      if (this.props.offset !== this.state.offset) {
        this.triggerUpdate(this.state.offset);
      // if props updated when the state did, we have a new offset we
      // need to scroll to
      } else if (prevProps.offset !== this.props.offset) {
        this.setScrollOffset();
      }
    }
  }

  componentWillUnmount() {
    // clean up our resize listener
    window.removeEventListener('resize', this.handleListLayout);
    // cancel any pending debounced update
    this.triggerUpdate.cancel();
  }

  // debounce the `onUpdate` prop
  triggerUpdate = debounce((offset) => {
    let { onUpdate } = this.props;
    if (onUpdate) onUpdate(offset);
  }, 300);

  // Sets the list's scrollTop based on the itemHeight and
  // current offset
  setScrollOffset() {
    let { itemHeight } = this.props;
    let { offset } = this.state;

    // $list is populated via the ref in the render method below
    if (this.$list) {
      this.$list.scrollTop = offset * itemHeight;
    }
  }

  // Handles setting the read offset based on the current scroll
  // position. Also calls `onUpdate` when an item has crossed the
  // threshold of what's considered to be active in the view
  handleScroll = (e) => {
    let { itemHeight } = this.props;

    let top = e.currentTarget.scrollTop;
    let offset = Math.floor(top / itemHeight);

    // update impagination's readOffset
    if (this.state.offset !== offset) {
      this.setState({ offset });
    }
  };

  // Handles updating our visible items count based on the list height
  handleListLayout = () => {
    let { itemHeight } = this.props;

    if (this.$list) {
      let listHeight = this.$list.offsetHeight;
      let visibleItems = Math.ceil(listHeight / itemHeight);
      this.setState({ visibleItems });
    }
  };

  renderChildren() {
    let { items, itemHeight, children } = this.props;
    let { offset, visibleItems } = this.state;

    let threshold = 5;
    let lower = Math.max(offset - threshold, 0);
    let upper = Math.min(offset + visibleItems + threshold, items.length - 1);

    // slice the visible items and map them to `children`
    return items.slice(lower, upper + 1).map((item, i) => {
      let index = lower + i;

      let style = {
        height: itemHeight,
        top: itemHeight * index
      };

      return (
        <li key={index} className={styles['list-item']} style={style}>
          {children(item, index)}
        </li>
      );
    });
  }

  render() {
    // strip all other props to pass along the rest to the div
    // eslint-disable-next-line no-unused-vars
    let { items, itemHeight, offset: _, onUpdate, scrollable, ...props } = this.props;
    let { offset, visibleItems } = this.state;
    let listHeight = items.length * itemHeight;

    // list height should be at least enough for the offset
    if (listHeight === 0) {
      listHeight = (offset + visibleItems) * itemHeight;
    }

    return (
      <div
        ref={(n) => { this.$list = n; }}
        className={cx('list', { locked: !scrollable })}
        onScroll={this.handleScroll}
        {...props}
      >
        <List style={{ height: listHeight }}>
          {this.renderChildren()}
        </List>
      </div>
    );
  }
}
