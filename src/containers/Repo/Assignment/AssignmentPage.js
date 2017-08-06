import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import {
  AssignmentForm,
  SSHLoginForm,
  GraderList,
  OutputContainer
} from 'components';
import {
  destroy,
  load,
  runScript,
  update,
  getGraders
} from 'redux/modules/assignment';
import socketId from 'utils/socket';

class AssignmentPage extends Component {
  static propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool,
    isLoaded: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    destroy: PropTypes.func.isRequired,
    assignment: PropTypes.object,
    load: PropTypes.func,
    repo: PropTypes.object,
    runScript: PropTypes.func.isRequired,
    hasChanged: PropTypes.bool,
    update: PropTypes.func.isRequired,
    getGraders: PropTypes.func.isRequired,
    previewList: PropTypes.array
  };

  constructor(props, context) {
    super(props, context);

    this.state = { previewIndex: 0 };
  }

  componentWillMount() {
    if (this.props.isLoaded) {
      this.props.load();
    } else {
      if (this.props.hasChanged) {
        // We just created this assignment so we should run the script
        this.props.runScript({
          socketId: socketId,
          assignment: this.props.assignment
        });
        this.setState({ previewIndex: 0 });
      } else if (this.props.repo) {
        // We're navigating into this assignment and we are already logged in
        this.props.getGraders(socketId, this.props.params.assignmentId);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasChanged) {
      // User just updated the assignment arguments so we should run the script
      this.props.runScript({
        socketId: socketId,
        assignment: nextProps.assignment
      });
      this.setState({ previewIndex: 0 });
    } else if (!this.props.repo && nextProps.repo) {
      // We just logged into the repository
      this.props.getGraders(socketId, this.props.params.assignmentId);
    }
  }

  componentWillUnmount() {
    this.props.destroy();
  }

  handleRefreshClick = event => {
    event.preventDefault();

    if (event.target.className.indexOf('disabled') === -1) {
      this.props.getGraders(socketId, this.props.params.assignmentId);
      this.setState({ previewIndex: 0 });
    }
  };

  handleLeftClick = event => {
    event.preventDefault();
    if (event.target.className.indexOf('disabled') === -1) {
      const { previewList } = this.props;
      const { previewIndex } = this.state;

      this.setState({
        previewIndex: previewIndex ? previewIndex - 1 : previewList.length - 1
      });
    }
  };

  handleRightClick = event => {
    event.preventDefault();
    if (event.target.className.indexOf('disabled') === -1) {
      const { previewList } = this.props;
      const { previewIndex } = this.state;

      this.setState({ previewIndex: (previewIndex + 1) % previewList.length });
    }
  };

  handleSubmit = data => {
    if (window.confirm('Are you sure you want to re-run the script?')) {
      this.props.update(data);
    }
  };

  render() {
    const { assignmentId, repoId } = this.props.params;
    const { assignment, error, repo, loading, previewList } = this.props;
    const { previewIndex } = this.state;

    return (
      <div>
        <Helmet title={assignmentId} />
        <div className="container">
          {(repo &&
            repo.username === repoId &&
            <div>
              <h2>
                {repoId}&nbsp;
                <a onClick={this.handleRefreshClick} title="Refresh">
                  <i
                    className={
                      'btn fa fa-refresh' +
                      (loading ? ' fa-pulse disabled' : '')
                    }
                  />
                </a>
              </h2>
              <div className="row">
                <div className="col-lg-8">
                  <GraderList assignmentId={assignmentId} repoId={repoId} />
                  {(previewList &&
                    previewList.length &&
                    <div>
                      <h3>
                        Preview&nbsp;
                        <a onClick={this.handleLeftClick}>
                          <i
                            className={
                              'btn fa fa-arrow-left' +
                              (loading ? ' disabled' : '')
                            }
                          />
                        </a>
                        <a onClick={this.handleRightClick}>
                          <i
                            className={
                              'btn fa fa-arrow-right' +
                              (loading ? ' disabled' : '')
                            }
                          />
                        </a>
                      </h3>
                      {!loading &&
                        <OutputContainer
                          viewHeight="50"
                          assignmentId={assignmentId}
                          graderId={previewList[previewIndex].split('/')[0]}
                          fileName={previewList[previewIndex].split('/')[1]}
                        />}
                    </div>) ||
                    (!error &&
                      !loading &&
                      <h1 className="alert alert-danger">
                        No assignments found! Please try running the script
                        again or make sure the repository path is correct!
                      </h1>) ||
                    (error &&
                      <h1 className="alert alert-danger">
                        {error.message}
                      </h1>)}
                </div>
                <div className="col-lg-4">
                  <AssignmentForm
                    repo={repo}
                    error={error}
                    loading={loading}
                    folderDisabled
                    assignment={assignment}
                    submitText="Re-Run Script"
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
    hasChanged: state.assignment.hasChanged,
    previewList: state.assignment.previewList,
    isLoaded: state.assignment.isLoaded,
    loading: state.assignment.loading,
    error: state.assignment.error
  }),
  {
    runScript,
    destroy,
    load,
    getGraders,
    update
  }
)(AssignmentPage);
