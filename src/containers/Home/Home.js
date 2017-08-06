import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { RepoForm, RepoList } from 'components';
import { create, load, destroy } from 'redux/modules/repo';

class Home extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    destroy: PropTypes.func.isRequired,
    error: PropTypes.object,
    load: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    repo: PropTypes.object,
    history: PropTypes.object
  };

  componentWillReceiveProps(nextProps) {
    const currentRepo = this.props.repo;
    const nextRepo = nextProps.repo;

    if (
      (!currentRepo && nextRepo) ||
      (nextRepo && nextRepo.username !== currentRepo.username)
    ) {
      // Created new repo
      this.props.history.push('/repo/' + nextRepo.username);
    }
  }

  componentWillMount() {
    this.props.load();
  }

  componentWillUnmount() {
    this.props.destroy();
  }

  handleSubmit = formData => {
    this.props.create(formData);
  };

  render() {
    const { error, loading } = this.props;

    return (
      <div>
        <Helmet title="Home" />
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <RepoList />
            </div>
            <div className="col-lg-3">
              <RepoForm
                onSubmit={this.handleSubmit}
                error={error}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    repo: state.repo.repo,
    error: state.repo.error,
    loading: state.repo.loading
  }),
  {
    create,
    destroy,
    load
  }
)(Home);
