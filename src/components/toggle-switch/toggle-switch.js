import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './toggle-switch.css';

const cx = classNames.bind(styles);

class ToggleSwitch extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    input: PropTypes.object,
    isPending: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      inputChecked: this.props.checked, // isPending is actually used in getDerivedStateFromProps
      isPending: this.props.isPending, // eslint-disable-line react/no-unused-state
    };
  }

  static getDerivedStateFromProps({ checked, isPending }, state) {
    const wasPending = state.isPending && !isPending;
    const needsUpdate = state.inputChecked !== checked;
    const inputChecked = wasPending || needsUpdate ? checked : state.inputChecked;
    return { inputChecked, isPending };
  }

  toggle = (e) => {
    if (this.props.input && this.props.input.onChange) {
      this.props.input.onChange(e);
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  render() {
    const { isPending, id, name, disabled, checked } = this.props;
    let inputChecked;
    if (this.props.input && this.props.checked) {
      inputChecked = this.state.inputChecked;
    } else {
      inputChecked = checked;
    }

    return (
      <div
        data-test-toggle-switch
        className={cx(styles['toggle-switch'], {
          'is-pending': isPending
        })}
        data-testid="toggle-switch"
      >
        <input
          type="checkbox"
          checked={(inputChecked !== undefined && inputChecked)}
          id={id}
          name={name}
          onChange={this.toggle}
          disabled={disabled || isPending}
          data-testid="toggle-switch-checkbox"
        />
        <div className={styles['toggle-switch-slider']} />
      </div>
    );
  }
}

export default ToggleSwitch;
