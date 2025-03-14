import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './list.css';

const cx = classNames.bind(styles);

const List = ({ className = '', fullWidth = false, ...props }) => {
  return (
    <ul
      className={cx(styles.list, { 'full-width': fullWidth }, className)}
      {...props}
    />
  );
};

List.propTypes = {
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default List;
