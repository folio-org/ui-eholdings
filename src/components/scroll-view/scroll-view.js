import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import debounce from 'lodash/debounce';

import styles from './scroll-view.css';
import List from '../list';

const cx = classNames.bind(styles);

export default class ScrollView extends Component {
  static getDerivedPropsFromState({ offset }, prevState) {
    return offset !== prevState.offset ? { offset } : prevState;
  }

  static propTypes = {
    children: PropTypes.func.isRequired,
    fullWidth: PropTypes.bool,
    itemHeight: PropTypes.number.isRequired,
    items: PropTypes.shape({
      length: PropTypes.number.isRequired,
      slice: PropTypes.func.isRequired
    }).isRequired,
    length: PropTypes.number,
    offset: PropTypes.number,
    onUpdate: PropTypes.func,
    queryListName: PropTypes.string.isRequired,
    scrollable: PropTypes.bool,
  };

  static defaultProps = {
    offset: 0,
    scrollable: true,
    fullWidth: false
  };

  constructor(props) {
    super(props);
    this.state = {
      offset: this.props.offset,
      visibleItems: 0,
    };
    // update the DOM element's scrollTop position with our offset
    this.setScrollOffset();
    // adjust the amount of visible items on resize
    window.addEventListener('resize', this.handleListLayout);
    this.handleListLayout();
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

    // update any layout changes
    this.handleListLayout();
  }

  componentWillUnmount() {
    // clean up our resize listener
    window.removeEventListener('resize', this.handleListLayout);
    // cancel any pending debounced update
    this.triggerUpdate.cancel();
  }

  // debounce the `onUpdate` prop
  triggerUpdate = debounce((offset) => {
    const { onUpdate } = this.props;
    if (onUpdate) onUpdate(offset);
  }, 300);

  // Sets the list's scrollTop based on the itemHeight and
  // current offset
  setScrollOffset() {
    const { itemHeight } = this.props;
    const { offset } = this.state;

    // $list is populated via the ref in the render method below
    if (this.$list) {
      this.$list.scrollTop = offset * itemHeight;
    }
  }

  // Handles setting the read offset based on the current scroll
  // position. Also calls `onUpdate` when an item has crossed the
  // threshold of what's considered to be active in the view
  handleScroll = (e) => {
    const { itemHeight } = this.props;

    const top = e.currentTarget.scrollTop;
    const offset = Math.floor(top / itemHeight);

    // update impagination's readOffset
    if (this.state.offset !== offset) {
      this.setState({ offset });
    }
  };

  // Handles updating our visible items count based on the list height
  handleListLayout = () => {
    const { itemHeight } = this.props;

    if (this.$list) {
      const listHeight = this.$list.offsetHeight;
      const visibleItems = Math.ceil(listHeight / itemHeight);

      if (visibleItems !== this.state.visibleItems) {
        this.setState({ visibleItems });
      }
    }
  };

  renderChildren() {
    const { items, length, itemHeight, children } = this.props;
    const { offset, visibleItems } = this.state;

    const threshold = 5;
    const lower = Math.max(offset - threshold, 0);
    const upper = Math.min(offset + visibleItems + threshold, (length || items.length) - 1);

    // slice the visible items and map them to `children`
    return items.slice(lower, upper + 1).map((item, i) => {
      const index = lower + i;

      const style = {
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
    const {
      items,
      length,
      itemHeight,
      scrollable,
      fullWidth,
      queryListName
    } = this.props;

    const {
      offset,
      visibleItems,
    } = this.state;


    let listHeight = (length || items.length) * itemHeight;

    // list height should be at least enough for the offset
    if (listHeight === 0) {
      listHeight = (offset + visibleItems) * itemHeight;
    }

    return (
      <div
        ref={(n) => { this.$list = n; }}
        className={cx('list', { locked: !scrollable })}
        onScroll={this.handleScroll}
        data-test-query-list={queryListName}
      >
        <List
          fullWidth={fullWidth}
          style={{ height: listHeight }}
        >
          {this.renderChildren()}
        </List>
      </div>
    );
  }
}
