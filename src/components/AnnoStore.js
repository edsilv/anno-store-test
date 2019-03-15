import React, { Component } from "react";
import AnnoStoreQuery from "./AnnoStoreQuery";

export default class AnnoStore extends Component {
  state = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      endpoint: nextProps.endpoint
    };
  }

  render() {
    const { endpoint, secret, query, queryResult } = this.state;

    if (endpoint) {
      return (
        <div>
          <input
            type="text"
            placeholder="secret"
            value={secret}
            onChange={ev =>
              this.setState({
                secret: ev.target.value
              })
            }
            style={{ width: "350px" }}
          />
          <button
            onClick={e =>
              this.setState({
                query: `${endpoint}s=${secret}`
              })
            }
          >
            submit
          </button>
          <div>query: {query}</div>
          {/*<textarea value={queryResult} rows="10" cols="60" />*/}
          <AnnoStoreQuery
            endpoint={endpoint}
            secret={secret}
            query={query}
            onQueryResult={r => {
              this.setState({
                queryResult: r
              });
            }}
          />
        </div>
      );
    } else {
      return <span>please supply an endpoint to query</span>;
    }
  }
}
