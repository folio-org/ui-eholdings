import { Component } from 'react';
import PropTypes from 'prop-types';
import Dataset from 'impagination';

/**
 * Patch the slice method of a Dataset state.
 *
 * Currently it is broken such that state.slice(x, y) will return a
 * slice with `undefined` values if the values of `x` and `y`
 * reference records that are out of the dataset bounds. Instead, the
 * standard JS behaviro is to truncate the slice at the last available
 * record. If there are no avaliable records, then it will be an empty
 * set.
 *
 *
 * @see https://github.com/flexyford/impagination/issues/48
 * @param {Object} datasetState - Dataset state instance
 * @returns {Object} new Dataset state instance
 */
function patchDatasetSlice(datasetState) {
  return Object.create(datasetState, {
    slice: {
      value(start, end) {
        let last = Math.min(end, this.length) - 1;
        let ret = [];

        for (let i = start; i <= last; i++) {
          ret.push(this.getRecord(i));
        }

        return ret;
      }
    }
  });
}

export default class Impagination extends Component {
  static propTypes = {
    pageSize: PropTypes.number,
    loadHorizon: PropTypes.number,
    readOffset: PropTypes.number,
    fetch: PropTypes.func.isRequired,
    collection: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    pageSize: 25,
    loadHorizon: 25,
    readOffset: 0
  };

  constructor(props) {
    super(props);

    // track promises for each page to resolve in
    // `componentWillReceiveProps` later
    this.promises = {};

    // impagination dataset
    this.dataset = new Dataset({
      pageSize: props.pageSize,
      loadHorizon: props.loadHorizon,
      stats: { totalPages: props.collection.totalPages },
      fetch: this.fetch,
      observe: this.observe
    });

    // initial state
    this.state = {
      datasetState: this.dataset.state
    };
  }

  // set the initial read offset of our dataset
  componentWillMount() {
    let { readOffset } = this.props;
    this.dataset.setReadOffset(readOffset);
  }

  // when we recieve an update, loop over the pages of collections so
  // we can resolve or reject any pending requests
  componentWillReceiveProps(nextProps) {
    let { collection } = nextProps;

    // we need to reset the dataset
    if (collection.key !== this.props.collection.key) {
      this.promises = {};

      // impagination dataset
      this.dataset = new Dataset({
        pageSize: nextProps.pageSize,
        loadHorizon: nextProps.loadHorizon,
        stats: { totalPages: collection.totalPages },
        fetch: this.fetch,
        observe: this.observe
      });
    }

    // if there is a new total page count, update our dataset state
    if (collection.totalPages !== this.dataset.state.stats.totalPages) {
      this.dataset.state.stats.totalPages = collection.totalPages;
    }

    // ensure that we keep all of our promises
    for (let page of Object.keys(this.promises)) {
      let { request, records } = collection.getPage(page);
      let promise = this.promises[page];

      if (promise) {
        if (request.isResolved) {
          promise.resolve(records);
          delete this.promises[page];
        } else if (request.isRejected) {
          promise.reject(request.errors);
          delete this.promises[page];
        }
      }
    }
  }

  componentDidUpdate() {
    let { readOffset } = this.props;

    // if there is a new read offset, tell our dataset
    if (readOffset !== this.dataset.state.readOffset) {
      this.dataset.setReadOffset(readOffset);
    }
  }

  /**
   * Used by impagination's dataset to resolve records
   * @param {Number} pageOffset - zero based page offset
   * @param {Number} pageSize - requested page size
   * @returns {Promise} resolves immediately or during the
   * componentWillReceiveProps hook later
   */
  fetch = (pageOffset, pageSize) => {
    // page starts with 1
    let page = pageOffset + 1;

    return new Promise((resolve, reject) => {
      let { request, records } = this.props.collection.getPage(page);

      // if the collection has already been resolved, immediately
      // resolve this promise
      if (request.isResolved) {
        resolve(records);

        // if the collection has already been rejected, immediately
        // reject this promise
      } else if (request.isRejected) {
        reject(request.errors);

        // the collection is not resolved or rejected already, make
        // the request now and handle resolution later on in the
        // componentWillReceiveProps hook
      } else {
        this.props.fetch(page, pageSize);

        // cache this promise's callbacks (and status) so it can be
        // resolved or rejected later on
        this.promises[page] = { resolve, reject };
      }
    });
  };

  /**
   * Used by impagination's dataset to observe its state
   * @param {Object} state - impagination's dataset state
   */
  observe = (state) => {
    this.setState(({
      datasetState: state
    }));
  };

  // We only call the `renderList` prop with the dataset state. Notice
  // we don't import React because we are not using JSX in this component
  render() {
    let datasetState = patchDatasetSlice(this.state.datasetState);
    return this.props.children(datasetState);
  }
}
