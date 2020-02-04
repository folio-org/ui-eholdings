import { Component } from 'react';
import PropTypes from 'prop-types';
import State from 'impagination/src/state';

/**
 * Patch / add methods to a Dataset state
 *
 * Due to the way the state's immutability is handled, we cannot
 * extend it to create a patched state class
 */
function patchDatasetState(dataset) {
  return Object.create(dataset, {
    /**
     * Currently it is broken such that `state.slice(start, end)` will
     * return a slice with `undefined` values if the values of `start`
     * and `end` reference records that have not yet been
     * requested. Instead, we use `state.getRecord(index)` to return
     * default records for unrequested pages instead of `undefined`.
     *
     * @see https://github.com/flexyford/impagination/issues/48
     */
    slice: {
      value(start, end) {
        const last = Math.min(end, this.length) - 1;
        const ret = [];

        for (let i = start; i <= last; i++) {
          ret.push(this.getRecord(i));
        }

        return ret;
      }
    },

    /**
     * Returns the pages within the load horizon
     */
    pagesWithinHorizon: {
      get() {
        const withinHorizon = [];

        // this private api is useful for getting the min and max pages in
        // a load horizon; it simply does some math around the readOffset
        // and loadHorizon properties so we also don't have to do it here
        const { minLoadHorizon, maxLoadHorizon } = this._getLoadHorizons();

        for (let i = minLoadHorizon; i < maxLoadHorizon; i++) {
          withinHorizon.push(this.getPage(i));
        }

        return withinHorizon;
      }
    }
  });
}

//  Updates the dataset immutably and triggers the `fetch` property
//  when there are unrequested pages.
function updateDataset(props, state) {
  const { collection, pageSize, loadHorizon, readOffset, fetch } = props;
  let dataset = state.dataset;

  const isNewCollection = collection.key !== state.collection.key;
  const hasUnloaded = patchDatasetState(dataset).pagesWithinHorizon.some(({ offset }) => {
    return collection.getPage(offset + 1).request.hasUnloaded;
  });

  // we need a brand new dataset state
  if (isNewCollection || hasUnloaded) {
    dataset = new State({
      pageSize,
      loadHorizon,
      readOffset,
      stats: {
        totalPages: collection.totalPages
      }
    });
  }

  //  update the total page count if necessary
  if (collection.totalPages !== dataset.stats.totalPages) {
    dataset.stats.totalPages = collection.totalPages;
  }

  // update the read offset if necessary
  if (readOffset !== dataset.readOffset) {
    dataset = dataset.setReadOffset(readOffset);
  }

  // make any requests for unrequested pages
  dataset.unrequested.forEach((p) => {
    // we use a 1-based page number
    fetch(p.offset + 1, pageSize);
  });

  // update newly requested pages
  dataset = dataset.fetch(dataset.unrequested);

  // resolve or reject all pages within the load horizon
  patchDatasetState(dataset).pagesWithinHorizon.forEach((page) => {
    // we use a 1-based page number
    const { request, records } = collection.getPage(page.offset + 1);

    if (page.isRequested && !request.hasUnloaded) {
      if (request.isResolved) {
        dataset = dataset.resolve(records, page.offset);
      } else if (request.isRejected) {
        dataset = dataset.reject(request.errors, page);
      }
    }
  });

  // update the state with the new dataset
  return dataset;
}

export default class Impagination extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    collection: PropTypes.object.isRequired,
    // this prop is most definitely used, but the way in which it gets
    // destructured from a default argument confuses eslint
    // eslint-disable-next-line react/no-unused-prop-types
    fetch: PropTypes.func.isRequired,
    loadHorizon: PropTypes.number,
    pageSize: PropTypes.number,
    readOffset: PropTypes.number
  };

  static defaultProps = {
    pageSize: 25,
    loadHorizon: 25,
    readOffset: 0
  };

  constructor(props) {
    super(props);
    // we can't set this directly as the state object because it will
    // lose getters and other prototype methods
    this.state = {
      // used in getDerivedStateFromProps
      // eslint-disable-next-line react/no-unused-state
      collection: this.props.collection,
      dataset: new State({
        pageSize: this.props.pageSize,
        loadHorizon: this.props.loadHorizon,
        readOffset: this.props.readOffset,
        stats: { totalPages: this.props.collection.totalPages }
      })
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const dataset = updateDataset(nextProps, prevState);
    return { collection: nextProps.collection, dataset };
  }

  // We treat `children` as a render prop and call it with the dataset
  // state. Notice we do not import React because we are not using any
  // JSX in this component
  render() {
    const dataset = patchDatasetState(this.state.dataset);
    return this.props.children(dataset);
  }
}
