import PropTypes from 'prop-types';

import styles from './key-value-columns.css';

const KeyValueColumns = ({ children }) => (
  <div className={styles['key-value-columns']}>
    {children}
  </div>
);

KeyValueColumns.propTypes = {
  children: PropTypes.node.isRequired,
};

export default KeyValueColumns;
