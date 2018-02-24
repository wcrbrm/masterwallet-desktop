// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Master Wallet</h2>
          <Link to="/accounts/create">click to add wallet or exchange account</Link>
        </div>
      </div>
    );
  }
}
