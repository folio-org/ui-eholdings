import { Component } from 'react';
import PropTypes from 'prop-types';
import Dataset from 'impagination';

export default class Impagination extends Component {
  static propTypes = {
    pageSize: PropTypes.number,
    loadHorizon: PropTypes.number,
    readOffset: PropTypes.number,
    fetch: PropTypes.func.isRequired,
    collections: PropTypes.object.isRequired,
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

      // the fetch option will return a promise that resolves during
      // the componentWillReceiveProps hook
      fetch: (pageOffset, pageSize) => {
        // page starts with 1
        let page = pageOffset + 1;

        return new Promise((resolve, reject) => {
          let collection = this.props.collections[page];
          let isFulfilled = false;

          if (collection && collection.request.isResolved) {
            resolve(collection.models);
            isFulfilled = true;
          } else if (collection && collection.request.isRejected) {
            reject(collection.request.errors);
            isFulfilled = true;
          } else {
            this.props.fetch(page, pageSize);
          }

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

  componentWillMount() {
    let { readOffset } = this.props;
    this.dataset.setReadOffset(readOffset);
  }

  componentWillReceiveProps(nextProps) {
    let { readOffset, collections } = nextProps;

    for (let page of Object.keys(collections)) {
      let promise = this.promises[page];
      let collection = collections[page];

      if (promise && !promise.isFulfilled) {
        if (collection.request.isResolved) {
          promise.resolve(collection.models);
          promise.isFulfilled = true;
        } else if (collection.request.isRejected) {
          promise.reject(collection.request.errors);
          promise.isFulfilled = true;
        }
      }
    }

    if (readOffset !== this.props.readOffset) {
      this.dataset.setReadOffset(readOffset);
    }
  }

  render() {
    let { renderList } = this.props;
    let { datasetState } = this.state;

    return renderList(datasetState);
  }
}
