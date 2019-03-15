import React, { Component } from "react";
import AnnoStoreQuery from "./AnnoStoreQuery";

export default class AnnoStore extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleSecretChange = this.handleSecretChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      endpoint: nextProps.endpoint
    };
  }

  handleSecretChange(ev) {
    this.setState({ secret: ev.target.value });
  }

  render() {
    const { endpoint, secret, id, queryTimestamp } = this.state;

    if (endpoint) {
      return (
        <div>
          <div>
            <input
              type="text"
              placeholder="secret"
              value={secret}
              onChange={this.handleSecretChange}
              style={{ width: "440px" }}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="id"
              value={id}
              onChange={this.handleIdChange}
              style={{ width: "440px" }}
            />
          </div>
          <div>
            <select>
              <option value="create">create</option>
              <option value="read">read</option>
              <option value="update">update</option>
              <option value="delete">delete</option>
            </select>
          </div>
          <div>
            <textarea placeholder="json" rows="10" cols="60" />
          </div>
          <button
            onClick={e =>
              this.setState({
                queryTimestamp: new Date().getTime()
              })
            }
          >
            submit
          </button>
          <div>query timestamp: {queryTimestamp}</div>
          <AnnoStoreQuery
            endpoint={endpoint}
            secret={secret}
            queryTimestamp={queryTimestamp}
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
