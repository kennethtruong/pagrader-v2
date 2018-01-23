import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import Helmet from 'react-helmet';
import './App.css';

const { Brand, Header, Toggle } = Navbar;

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="App">
        <Helmet title="PAGrader" />
        {
          // user &&
          <Navbar fixedTop>
            <Header>
              <Brand>
                <Link to="/">PAGrader</Link>
              </Brand>
              <Toggle />
            </Header>
          </Navbar>
        }

        <div className="App-Content">
          {this.props.children}
        </div>

        <div className="App-Footer text-center">
          Have questions or see issues? Submit them{' '}
          <a
            href="https://github.com/k2truong/pagrader-v2/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            on Github
          </a>{' '}
          or email me at kenneth.e.truong@gmail.com.
        </div>
      </div>
    );
  }
}
