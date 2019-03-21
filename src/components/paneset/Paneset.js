import React, { Children, Component } from 'react';

import Pane from './Pane';
import css from './Paneset.css';

function nodeOfType(Type) {
  // eslint-disable-next-line consistent-return
  return (props, propName, componentName) => {
    for (const child of Children.toArray(props[propName])) {
      if (!(child.type.prototype instanceof Type)) {
        return new Error(`\`${componentName}\` ${propName} should be of type \`${Type.name}\`.`);
      }
    }
  };
}

export default class Paneset extends Component {
  static propTypes = {
    children: nodeOfType(Pane)
  };

  render() {
    return (
      <div className={css.paneset}>
        {this.props.children}
      </div>
    );
  }
}
