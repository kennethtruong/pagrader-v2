import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { AssignmentForm, SSHLoginForm, AssignmentList } from 'components';
import { create, loadList } from 'redux/modules/assignment';

class Repo extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    error: PropTypes.object,
    loading: PropTypes.bool,
    loadList: PropTypes.func.isRequired,
    assignment: PropTypes.object,
    repo: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object
  };

  componentWillMount() {
    this.props.loadList(this.props.match.params.repoId);
  }

  componentWillReceiveProps(nextProps) {
    const currentAssignment = this.props.assignment;
    const nextAssignment = nextProps.assignment;

    if (
      (!currentAssignment && nextAssignment) ||
      (nextAssignment && nextAssignment.name !== currentAssignment.name)
    ) {
      // Created new assignment so we run the script and go to assignment page
      this.props.history.push(
        `/repo/${nextAssignment.repo}/${nextAssignment.name}`
      );
    }
  }

  handleSubmit = data => {
    this.props.create(data);
  };

  render() {
    const { repoId } = this.props.match.params;
    const { repo, error, loading } = this.props;

    return (
      <div>
        <Helmet title="Repo" />
        <div className="container">
          {(repo &&
            repo.username === repoId &&
            <div>
              <h2>
                {repoId}
              </h2>
              <div className="row">
                <div className="col-lg-8">
                  <AssignmentList />
                </div>
                <div className="col-lg-4">
                  <AssignmentForm
                    repo={repo}
                    error={error}
                    loading={loading}
                    submitText="+New Assignment"
                    onSubmit={this.handleSubmit}
                  />
                </div>
              </div>
            </div>) ||
            <SSHLoginForm repoId={repoId} />}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    repo: state.repo.repo,
    assignment: state.assignment.assignment,
    loading: state.assignment.loading,
    error: state.repo.error
  }),
  {
    create,
    loadList
  }
)(Repo);
