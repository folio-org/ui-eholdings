import { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './query-list.css';
import ScrollView from '../scroll-view';
import PrevNextButtons from '../prev-next-buttons';
import ImpaginationReplacement from './ImpaginationReplacement';
import { PAGE_SIZE } from '../../constants';

export default class QueryList extends Component {
  static propTypes = {
    collection: PropTypes.object.isRequired,
    fetch: PropTypes.func.isRequired,
    fullWidth: PropTypes.bool,
    isMainPageSearch: PropTypes.bool,
    itemHeight: PropTypes.number.isRequired,
    length: PropTypes.number,
    notFoundMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]).isRequired,
    offset: PropTypes.number,
    onUpdateOffset: PropTypes.func.isRequired,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    renderItem: PropTypes.func.isRequired,
    scrollable: PropTypes.bool,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    fullWidth: false,
    isMainPageSearch: false,
    offset: 0,
    page: 1,
    pageSize: PAGE_SIZE,
  }

  constructor(props) {
    super(props);
    this.state = {
      offset: this.props.offset || 0,
    };
  }

  updateOffset = (offset) => {
    if (!this.props.isMainPageSearch) {
      this.setState({ offset });

      if (this.props.onUpdateOffset) {
        this.props.onUpdateOffset(offset);
      }
    }
  }

  updatePage = (page) => {
    if (this.props.onUpdateOffset) {
      this.props.onUpdateOffset(page);
    }
  }

  getPrevNextButtons = () => {
    const {
      collection: {
        isPending,
        length,
      },
      isMainPageSearch,
      page,
    } = this.props;

    if (isMainPageSearch) {
      return (
        <PrevNextButtons
          isLoading={isPending}
          totalResults={length}
          fetch={this.updatePage}
          page={page}
        />
      );
    }

    return null;
  }

  render() {
    const {
      type,
      pageSize,
      scrollable,
      notFoundMessage,
      collection,
      fetch,
      itemHeight,
      renderItem,
      length,
      fullWidth,
      page,
      isMainPageSearch,
    } = this.props;
    const {
      offset,
    } = this.state;

    const offsetProp = isMainPageSearch ? page : offset;

    return (
      <ImpaginationReplacement
        pageSize={pageSize}
        page={page}
        collection={collection}
        fetch={fetch}
      >
        {state => (
          state.hasRejected && !state.length ? (
            <div className={styles.error} data-test-query-list-error={type}>
              {state.rejected[0].error[0].title}
            </div>
          ) : !state.length
            ? notFoundMessage
            : (
              <ScrollView
                items={state}
                length={length}
                offset={offsetProp}
                isMainPageSearch
                itemHeight={itemHeight}
                scrollable={scrollable}
                onUpdate={this.updateOffset}
                queryListName={type}
                fullWidth={fullWidth}
                prevNextButtons={this.getPrevNextButtons()}
              >
                {item => (
                  <div className={styles['list-item']} data-test-query-list-item>
                    {renderItem(item)}
                  </div>
                )}
              </ScrollView>
            )
        )}
      </ImpaginationReplacement>
    );
  }
}
