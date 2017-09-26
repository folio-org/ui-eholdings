import React from 'react';
import PropTypes from 'prop-types';
import styles from './results-pane.css';

export default class ResultsPane extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div className={styles['results-pane']}>
        {this.props.children}
      </div>
    );
  }
}
