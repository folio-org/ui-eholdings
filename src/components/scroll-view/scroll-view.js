import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

import styles from './scroll-view.css';
import List from '../list';

export default class ScrollView extends Component {
  static propTypes = {
    length: PropTypes.number,
    offset: PropTypes.number,
    itemHeight: PropTypes.number.isRequired,
    onUpdate: PropTypes.func,
    children: PropTypes.node.isRequired
  };

  static defaultProps = {
    length: 0,
    offset: 0
  };

  state = {
    offset: this.props.offset,
    visibleItems: 0
  };

  // update the DOM element's scrollTop position with our initial
  // page offset and decide the initial visible item count
  componentDidMount() {
    let { itemHeight } = this.props;
    let { offset } = this.state;

    // $list is populated via the ref in the render method below
    if (this.$list) {
      this.$list.scrollTop = offset * itemHeight;

      // adjust the amount of visible items on resize
      window.addEventListener('resize', this.handleListLayout);
      this.handleListLayout();
    }
  }

  componentWillReceiveProps({ offset }) {
    // new offset that's different from the state
    if (offset !== this.props.offset && offset !== this.state.offset) {
      this.setState({ offset });
    }
  }

  // clean up our resize listener
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleListLayout);
  }

  // Handles setting the read offset based on the current scroll
  // position. Also calls `onPage` when a new page has crossed the
  // threshold of what's considered to be active the view
  handleScroll = (e) => {
    let { itemHeight, onUpdate } = this.props;

    let top = e.target.scrollTop;
    let offset = Math.floor(top / itemHeight);

    // update impagination's readOffset
    if (this.state.offset !== offset) {
      this.setState({ offset });
      onUpdate(offset);
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
    let { itemHeight, children } = this.props;
    let { offset, visibleItems } = this.state;
    let threshold = 5;

    let calcStyle = i => ({
      height: itemHeight,
      top: i * itemHeight
    });

    // calculate the positions before filtering
    let items = Children.map(children, (child, i) => (
      <li key={i} className={styles['list-item']} style={calcStyle(i)}>
        {child}
      </li>
    ));

    return items.filter((child, i) => {
      let isAboveLowerThresh = i > offset - threshold;
      let isBelowUpperThresh = i < offset + visibleItems + threshold;
      return isAboveLowerThresh && isBelowUpperThresh;
    });
  }

  render() {
    // strip all other props to pass along the rest to the div
    // eslint-disable-next-line no-unused-vars
    let { length, itemHeight, offset: _, onUpdate, ...props } = this.props;
    let { offset, visibleItems } = this.state;
    let listHeight = length * itemHeight;

    // list height should be at least enough for the offset
    if (listHeight === 0) {
      listHeight = (offset + visibleItems) * itemHeight;
    }

    return (
      <div
        ref={(n) => { this.$list = n; }}
        className={styles.list}
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
