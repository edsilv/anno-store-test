import React, { Component } from "react";

export default class AnnoStoreQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Store prevQuery in state so we can compare when props change.
    // Clear out any previously-loaded result data (so we don't render stale stuff).
    if (nextProps.queryTimestamp !== prevState.queryTimestamp) {
      return {
        queryTimestamp: nextProps.queryTimestamp,
        endpoint: nextProps.endpoint,
        queryType: nextProps.queryType,
        secret: nextProps.secret,
        annotation: nextProps.annotation,
        queryResult: null,
        error: null
      };
    }

    // No state update necessary
    return null;
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error: error };
  }

  componentDidMount() {
    // It's preferable in most cases to wait until after mounting to load data.
    // See below for a bit more context...
    this._queryEndpoint();
  }

  componentDidUpdate(prevProps, prevState) {
    const { error, queryResult } = this.state;

    if (error === null && queryResult === null) {
      // At this point, we're in the "commit" phase, so it's safe to load the new data.
      this._queryEndpoint();
    }
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    //console.log(error);
  }

  renderDebug() {
    const { endpoint, query } = this.state;
    return [
      <div>
        query: {endpoint}
        {query}
      </div>
    ];
  }

  render() {
    const { queryResult, error } = this.state;

    if (queryResult) {
      return [this.renderDebug(), <div>query result: {queryResult}</div>];
    } else if (error) {
      return [this.renderDebug(), <div>query error: {error}</div>];
    } else {
      return [this.renderDebug(), <div>no query result</div>];
    }
  }

  _buildQuery(query) {
    return Object.keys(query).reduce((acc, val) => {
      if (!query[val]) {
        return acc;
      }
      return `${acc}${(acc && "&") || "?"}${val}=${query[val]}`;
    }, "");
  }

  _queryEndpoint() {
    // Cancel any in-progress requests
    // Load new data and update result
    const { queryTimestamp, endpoint, secret, annotation } = this.state;
    const { onQueryResult } = this.props;

    // if (endpoint && secret) {
    //   setTimeout(() => {
    //     //throw new Error("test fail");
    //     const queryResult = "test fail";
    //     this.setState({
    //       queryResult: queryResult
    //     });
    //     onQueryResult(queryResult);
    //   }, 1000);
    // }

    if (!queryTimestamp) {
      this.setState({
        queryResult: "waiting for queries"
      });
      return;
    }

    if (!endpoint) {
      this.setState({
        error: "no endpoint specified"
      });
      return;
    }

    if (!secret) {
      this.setState({
        error: "no secret specified"
      });
      return;
    }

    let opts = {
      s: secret,
      body: encodeURIComponent(annotation)
    };

    let query = this._buildQuery(opts);
    let url = `${endpoint}${query}`;
    let fetchOpts = {
      method: "POST",
      mode: "no-cors", // no-cors, cors, *same-origin
      cache: "no-cache",
      json: true
    };

    fetch(url, fetchOpts)
      .then(res => res.json())
      .then(
        queryResult => {
          this.setState({
            query: query,
            queryResult: queryResult
          });
          onQueryResult(queryResult);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            query: query,
            error: error.message
          });
          onQueryResult(error);
        }
      );
  }
}
