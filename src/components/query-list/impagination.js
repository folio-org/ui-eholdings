import { Component } from 'react';
import PropTypes from 'prop-types';
import Dataset from 'impagination';

export default class Impagination extends Component {
  static propTypes = {
    pageSize: PropTypes.number,
    loadHorizon: PropTypes.number,
    readOffset: PropTypes.number,
    totalPages: PropTypes.number,
    fetch: PropTypes.func.isRequired,
    collection: PropTypes.object.isRequired,
    renderList: PropTypes.func.isRequired
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
      stats: { totalPages: props.totalPages },

      // the fetch option will return a promise that might resolve
      // later during the componentWillReceiveProps hook
      fetch: (pageOffset, pageSize) => {
        // page starts with 1
        let page = pageOffset + 1;

        return new Promise((resolve, reject) => {
          let { request, records } = this.props.collection.getPage(page);
          let isFulfilled = false;

          // if the collection has already been resolved, immediately
          // resolve this promise
          if (request.isResolved) {
            resolve(records);
            isFulfilled = true;

          // if the collection has already been rejected, immediately
          // reject this promise
          } else if (request.isRejected) {
            reject(request.errors);
            isFulfilled = true;

          // the collection is not resolved or rejected already, make
          // the request now and handle resolution later on in the
          // componentWillReceiveProps hook
          } else {
            this.props.fetch(page, pageSize);
          }

          // cache this promise's callbacks (and status) so it can be
          // resolved or rejected later on
          this.promises[page] = {
            resolve,
            reject,
            isFulfilled
          };
        });
      },

      // we update our own state when the dataset state changes
      observe: (state) => {
        this.setState(({
          datasetState: state
        }));
      }
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
    let { readOffset, totalPages, collection } = nextProps;

    // if there is a new total page count, update our dataset state
    if (totalPages !== this.props.totalPages) {
      this.dataset.state.stats.totalPages = totalPages;
    }

    for (let page of Object.keys(this.promises)) {
      let promise = this.promises[page];
      let { request, records } = collection.getPage(page);

      if (promise && !promise.isFulfilled) {
        if (request.isResolved) {
          promise.resolve(records);
          promise.isFulfilled = true;
        } else if (request.isRejected) {
          promise.reject(request.errors);
          promise.isFulfilled = true;
        }
      }
    }

    // if there is a new read offset, tell our dataset
    if (readOffset !== this.props.readOffset) {
      this.dataset.setReadOffset(readOffset);
    }
  }

  // We only call the `renderList` prop with the dataset state. Notice
  // we don't import React because we are not using JSX in this component
  render() {
    let { renderList } = this.props;
    let { datasetState } = this.state;

    return renderList(datasetState);
  }
}
