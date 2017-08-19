import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PrismCode } from 'react-prism';
import { socket } from 'utils/socket';
import './OutputContainer.css';

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  // Prepend `/api` to relative URL, to proxy to API server.
  return '/api' + adjustedPath;
}

export default class OutputContainer extends Component {
  static propTypes = {
    fileName: PropTypes.string.isRequired,
    language: PropTypes.string,
    error: PropTypes.object,
    viewHeight: PropTypes.string.isRequired,
    assignmentId: PropTypes.string.isRequired,
    graderId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      output: null,
      loading: true
    };
  }

  assign(socketid, assignmentId, graderId, fileName) {
    //sets the state of the assignment to the file output

    fetch(
      formatUrl(
        `/ssh/getFile/${socketid}/${assignmentId}/${graderId}/${fileName}`
      )
    ).then(res => {
      if (res.ok) {
        res.text().then(out => {
          this.setState({ output: out, loading: false });
        });
      }
    });
  }

  componentWillMount() {
    const { assignmentId, graderId, fileName } = this.props;
    this.assign(socket.id, assignmentId, graderId, fileName);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fileName !== nextProps.fileName) {
      const { assignmentId, graderId, fileName } = nextProps;
      this.assign(socket.id, assignmentId, graderId, fileName);
    }
  }

  createMarkup = () => {
    // TODO: Fix this where the assignments we display can expose a vulnerability in their output
    return { __html: this.props.loading ? '' : this.state.output };
  };

  render() {
    const { fileName, viewHeight, error, loading, language } = this.props;

    return (
      <div className="outputContainer">
        {error &&
          <h1 className="alert alert-danger">
            {error.message} &quot;{fileName}&quot;
          </h1>}
        {!error &&
          <div>
            <h4>
              {fileName.replace('/\\.[^\\.]+$/', '')}
            </h4>
            {(fileName.endsWith('txt') &&
              ((language &&
                <pre
                  className="line-numbers"
                  style={{ height: `${viewHeight}vh` }}
                >
                  <PrismCode className={`language-${language}`}>
                    {!loading && this.state.output}
                  </PrismCode>
                </pre>) ||
                <pre style={{ height: `${viewHeight}vh` }}>
                  {!loading && this.state.output}
                </pre>)) ||
              <pre
                style={{ height: `${viewHeight}vh` }}
                dangerouslySetInnerHTML={this.createMarkup()}
              />}
          </div>}
      </div>
    );
  }
}
