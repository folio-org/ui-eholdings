import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import debounce from 'lodash/debounce';

import styles from './scroll-view.css';
import List from '../list';
import { PAGE_SIZE } from '../../constants';

const cx = classNames.bind(styles);

export default class ScrollView extends Component {
  static getDerivedPropsFromState({ offset }, prevState) {
    return offset !== prevState.offset ? { offset } : prevState;
  }

  static propTypes = {
    children: PropTypes.func.isRequired,
    fullWidth: PropTypes.bool,
    isMainPageSearch: PropTypes.bool,
    itemHeight: PropTypes.number.isRequired,
    items: PropTypes.shape({
      length: PropTypes.number.isRequired,
      slice: PropTypes.func.isRequired
    }).isRequired,
    length: PropTypes.number,
    offset: PropTypes.number,
    onUpdate: PropTypes.func,
    prevNextButtons: PropTypes.node,
    queryListName: PropTypes.string.isRequired,
    scrollable: PropTypes.bool,
  };

  static defaultProps = {
    isMainPageSearch: false,
    offset: 0,
    scrollable: true,
    fullWidth: false,
    prevNextButtons: null,
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
    const {
      isMainPageSearch,
      offset,
    } = this.props;

    if (isMainPageSearch && prevProps.offset !== offset) {
      this.setScrollOffset();
    }
    // did the state update
    if (prevState.offset !== this.state.offset) {
      // props are outdated, need to call onUpdate
      if (offset !== this.state.offset) {
        this.triggerUpdate(this.state.offset);
        // if props updated when the state did, we have a new offset we
        // need to scroll to
      } else if (prevProps.offset !== offset) {
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
    const {
      isMainPageSearch,
      itemHeight,
    } = this.props;
    const { offset } = this.state;

    // $list is populated via the ref in the render method below
    if (this.$list) {
      this.$list.scrollTop = isMainPageSearch ? 0 : offset * itemHeight;
    }
  }

  // // Handles setting the read offset based on the current scroll
  // // position. Also calls `onUpdate` when an item has crossed the
  // // threshold of what's considered to be active in the view
  // handleScroll = (e) => {
  //   const { itemHeight } = this.props;

  //   const top = e.currentTarget.scrollTop;
  //   const offset = Math.floor(top / itemHeight);

  //   // update impagination's readOffset
  //   if (this.state.offset !== offset) {
  //     this.setState({ offset });
  //   }
  // };

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
    const {
      items,
      length,
      itemHeight,
      children,
      offset: page,
    } = this.props;
    const {
      offset,
      visibleItems,
    } = this.state;

    const threshold = 5;
    const lower = 0;
    // const lower = page
    //   ? (page - 1) * PAGE_SIZE
    //   : Math.max(offset - threshold, 0);

    const upper = page
      ? page * PAGE_SIZE
      : length || items.length;
    // const upper = page
    //   ? page * PAGE_SIZE
    //   : Math.min(offset + visibleItems + threshold, (length || items.length) - 1) + 1;

    // slice the visible items and map them to `children`

    return items.slice(lower, upper).map((item, i) => {
      const index = lower + i;
      const top = itemHeight * (page ? i : index);

      const style = {
        height: itemHeight,
        top,
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
      itemHeight,
      scrollable,
      fullWidth,
      queryListName,
      prevNextButtons,
      offset: page,
      isMainPageSearch,
      length,
    } = this.props;

    const {
      offset,
      visibleItems,
    } = this.state;

    let listHeight = (length || items.length) * itemHeight;

    // if (isMainPageSearch) {
    //   listHeight = items.length <= (PAGE_SIZE * page)
    //     ? items.length % PAGE_SIZE
    //     : PAGE_SIZE;
    // }

    // // list height should be at least enough for the offset
    // if (listHeight === 0) {
    //   listHeight = offset + visibleItems;
    // }

    // listHeight *= itemHeight;

    return (
      <div
        ref={(n) => { this.$list = n; }}
        className={cx('list', { locked: !scrollable })}
        // onScroll={this.handleScroll}
        data-test-query-list={queryListName}
        data-testid={queryListName}
      >
        <List
          fullWidth={fullWidth}
          style={{ height: listHeight }}
          data-testid="scroll-view-list"
        >
          {this.renderChildren()}
        </List>
        {prevNextButtons}
      </div>
    );
  }
}
