import React from 'react';
import styles from './list.css';

export default function List({ className, ...props }) {
  return <ul className={[styles['list'], className].join(' ')} {...props}/>;
}
