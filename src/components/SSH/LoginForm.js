import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { connect as sshConnect, destroy } from 'redux/modules/repo';
import { socket } from 'utils/socket';
import './LoginForm.css';

class SSHLoginForm extends Component {
  static propTypes = {
    sshConnect: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.object,
    repoId: PropTypes.string,
    destroy: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.destroy();
  }

  setUserInput = r => {
    this.username = r;
  };

  setPassInput = r => {
    this.password = r;
  };

  handleSubmit = event => {
    event.preventDefault();

    if (!this.props.loading) {
      const username = this.username;
      const password = this.password;

      this.props.sshConnect({
        username: username.value,
        password: password.value,
        socketId: socket.id
      });
      password.value = '';
    }
  };

  render() {
    const { error, loading, repoId } = this.props;
    // const { repoID } = this.props.params;

    return (
      // TODO: Move to own component
      <div className="login-card text-center">
        <h1>SSH Login</h1>
        {error &&
          <span>
            {error.message}
          </span>}
        <div>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                ref={this.setUserInput}
                value={repoId}
                disabled
                placeholder="Username or email"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                ref={this.setPassInput}
                placeholder="Password"
                className="form-control"
              />
            </div>
            <button
              className={
                (loading ? 'disabled ' : '') + 'btn btn-block btn-primary'
              }
              onClick={this.handleSubmit}
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: state.repo.loading,
    error: state.repo.error
  }),
  {
    sshConnect,
    destroy
  }
)(SSHLoginForm);
