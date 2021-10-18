import { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import styles from './scroll-view.css';
import List from '../list';
import { PAGE_SIZE } from '../../constants';

class ScrollView extends Component {
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
    offset: PropTypes.number,
    onUpdate: PropTypes.func,
    prevNextButtons: PropTypes.node,
    queryListName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    isMainPageSearch: false,
    offset: 0,
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
      itemHeight,
      children,
      offset: page,
    } = this.props;

    const lower = 0;

    const upper = page
      ? page * PAGE_SIZE
      : items.length;

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
      fullWidth,
      queryListName,
      prevNextButtons,
    } = this.props;

    const listHeight = items.length * itemHeight;

    return (
      <div
        ref={(n) => { this.$list = n; }}
        className={styles.list}
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

export default ScrollView;
