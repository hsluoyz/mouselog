import React from "react";
import * as Setting from "./Setting";
import * as Shared from "./Shared";
import {Table, Row, Col, Typography, Tag} from 'antd';
import {Link} from "react-router-dom";
import Canvas from "./Canvas";
import * as Backend from "./Backend";

const {Text} = Typography;

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      sessions: [],
      sessionId: "",
      traces: [],
      trace: null,
      hoverRowIndex: -1,
    };
  }

  componentDidMount() {
    Backend.listSessions()
    .then(res => res.json())
    .then(res => {
      this.setState({
        sessions: res
      });
    });
  }

  getCMTable(tn, fp, fn, tp) {
    // return (
    //     <table>
    //       <tr>
    //         <td>TN: <Tag color="rgb(68,1,84)">{`${tn}`}</Tag></td>
    //         <td>FP: <Tag color="rgb(253,231,36)">{`${fp}`}</Tag></td>
    //       </tr>
    //       <tr>
    //         <td>FN: <Tag color="rgb(253,231,36)">{`${fn}`}</Tag></td>
    //         <td>TP: <Tag color="rgb(68,1,84)">{`${tp}`}</Tag></td>
    //       </tr>
    //     </table>
    // )

    return (
        <table>
          <tr>
            <td>TN: <Tag color="rgb(68,1,84)">{`${tn}`}</Tag></td>
            <td>FP: <Tag color="rgb(253,231,36)">{`${fp}`}</Tag></td>
            <td>FN: <Tag color="rgb(253,231,36)">{`${fn}`}</Tag></td>
            <td>TP: <Tag color="rgb(68,1,84)">{`${tp}`}</Tag></td>
          </tr>
        </table>
    )
  }

  renderSessionTable() {
    const columns = [
      {
        title: 'Session ID (dataset)',
        dataIndex: 'sessionId',
        key: 'sessionId',
        render: (text, record, index) => {
          return <Link to={`/trace/${text}`} target='_blank'>{text}</Link>
        }
      },
      {
        title: 'Trace Count',
        dataIndex: 'traceSize',
        key: 'traceSize',
      },
      {
        title: 'Confusing Matrix',
        key: 'cm',
        render: (text, session, index) => {
          return this.getCMTable(session.tn, session.fp, session.fn, session.tp);
        }
      },
      {
        title: 'Precision (%)',
        key: 'precision',
        render: (text, session, index) => {
          return (session.tp * 100.0 / (session.tp + session.fp)).toFixed(2)
        }
      },
      {
        title: 'Recall (%)',
        key: 'recall',
        render: (text, session, index) => {
          return (session.tp * 100.0 / (session.tp + session.fn)).toFixed(2)
        }
      },
      // {
      //   title: 'UN',
      //   dataIndex: 'un',
      //   key: 'un',
      // },
    ];

    const rowRadioSelection = {
      type: 'radio',
      columnTitle: 'Select',
      onSelect: (selectedRowKeys, selectedRows) => {
        // console.log(selectedRowKeys, selectedRows);
        
        Backend.listTrace(selectedRowKeys.sessionId)
        .then(res => res.json())
        .then(res => {
          this.setState({
            traces: res.traces,
            fileId: selectedRowKeys.sessionId
          });
        });
      },
    };

    return (
        <div>
          <Table rowSelection={rowRadioSelection} columns={columns} dataSource={this.state.sessions} size="small"
                 bordered title={() => 'Sessions'}/>
        </div>
    );
  }

  rowHoverHandler(hoverRowIndex) {
    this.setState({
      hoverRowIndex: hoverRowIndex,
    });
  }

  render() {
    return (
        <div>
          <Row>
            <Col span={12}>
              {
                this.renderSessionTable()
              }
              <Row>
                <Col span={12} style={{paddingRight: '2.5px'}}>
                  {
                    Shared.renderTraceTable(this.state.fileId, this.state.traces, this)
                  }
                </Col>
                <Col span={12} style={{paddingLeft: '2.5px'}}>
                  {
                    (this.state.trace !== null) ? Shared.renderEventTable(this.state.trace.id, this.state.trace.events, false, this.rowHoverHandler.bind(this)) : Shared.renderEventTable('', [])
                  }
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Canvas trace={this.state.trace} size={Shared.getSize(this.state.trace, 2)} focusIndex={this.state.hoverRowIndex} />
            </Col>
          </Row>

        </div>
    );
  }

}

export default DashboardPage;
