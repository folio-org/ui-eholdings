import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

/**
 * Higher order component that, when given the prop
 * `shouldFocus={true}`, will focus the component's DOM node on mount
 * and on update when the prop is toggled from `false` to `true`.
 */
export default function shouldFocus(Focusable) {
  return class extends Component {
    static propTypes = {
      shouldFocus: PropTypes.bool
    };

    componentDidMount() {
      if (this.props.shouldFocus) {
        this.focusable.focus();
      }
    }

    componentDidUpdate(prevProps) {
      if (this.props.shouldFocus && !prevProps.shouldFocus) {
        this.focusable.focus();
      }
    }

    get focusable() {
      // eslint-disable-next-line react/no-find-dom-node
      return findDOMNode(this);
    }

    render() {
      return (
        <Focusable {...this.props} />
      );
    }
  };
}
