import React, { Component } from "react";
import AnnoStoreQuery from "./AnnoStoreQuery";

export default class AnnoStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryType: "save",
      annotation: JSON.stringify({
        type: "annotation",
        motivation: "supplementing",
        body: [
          {
            id: "sometarget",
            type: "DataSet",
            value: {
              hello: "world"
            },
            format: "application/json"
          }
        ]
      })
    };

    this.handleSecretChange = this.handleSecretChange.bind(this);
    this.handleQueryTypeChange = this.handleQueryTypeChange.bind(this);
    this.handleAnnotationChange = this.handleAnnotationChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      endpoint: nextProps.endpoint
    };
  }

  handleSecretChange(ev) {
    this.setState({ secret: ev.target.value });
  }

  handleQueryTypeChange(ev) {
    this.setState({ queryType: ev.target.value });
  }

  handleAnnotationChange(ev) {
    this.setState({ annotation: ev.target.value });
  }

  renderDebug() {
    const { annotation, queryTimestamp } = this.state;
    return [<div>query timestamp: {queryTimestamp}</div>];
  }

  render() {
    const {
      endpoint,
      secret,
      id,
      queryType,
      queryTimestamp,
      annotation
    } = this.state;

    if (endpoint) {
      return [
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
            <select value={queryType} onChange={this.handleQueryTypeChange}>
              <option value="save">save</option>
              <option value="edit">edit</option>
              <option value="delete">delete</option>
            </select>
          </div>
          <div>
            <textarea
              placeholder="anno json"
              rows="10"
              cols="60"
              onChange={this.handleAnnotationChange}
              value={annotation}
            />
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
        </div>,
        this.renderDebug(),
        <AnnoStoreQuery
          endpoint={endpoint}
          secret={secret}
          queryTimestamp={queryTimestamp}
          queryType={queryType}
          annotation={annotation}
          onQueryResult={r => {
            this.setState({
              queryResult: r
            });
          }}
        />
      ];
    } else {
      return <span>please supply an endpoint to query</span>;
    }
  }
}
