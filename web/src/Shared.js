import React from "react";
import {Table, Tag, Typography} from "antd";
const {Text} = Typography;

export function getPoints(trace, scale) {
  if (trace === null) {
    return [];
  }

  let points = [];
  trace.events.forEach(function (event) {
    points.push(event.x * scale);
    points.push(event.y * scale);
  });
  return points;
}

export function renderEventTable(title, events, isLong=false, rowHoverHandler=null) {
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Event Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Button',
      dataIndex: 'button',
      key: 'button',
    },
    {
      title: 'X',
      dataIndex: 'x',
      key: 'x',
    },
    {
      title: 'Y',
      dataIndex: 'y',
      key: 'y',
    }
  ];

  let handleRow = record => {
    return {
      onMouseEnter: event => {
        // alert(record);
        rowHoverHandler(record.id);
      },
      onMouseLeave: event => {
        rowHoverHandler(-1);
      }
    }
  };
  if (rowHoverHandler === null) {
    handleRow = null;
  }

  if (!isLong) {
    return (
        <div>
          <Table columns={columns} dataSource={events} size="small" bordered pagination={{pageSize: 100}} scroll={{y: 'calc(95vh - 450px)'}}
                 title={() => <div><Text>Events for: </Text><Tag color="#108ee9">{title}</Tag></div>} onRow={handleRow}/>
        </div>
    );
  } else {
    return (
        <div>
          <Table columns={columns} dataSource={events} size="small" bordered
                 title={() => <div><Text>Events for: </Text><Tag color="#108ee9">{title}</Tag></div>} pagination={{pageSize: 100}} scroll={{y: 700}} onRow={handleRow} />
        </div>
    );
  }
}

export function getSizeSmall() {
  const scale = 0.49;
  const width = document.body.scrollWidth * scale;
  const height = document.body.scrollHeight * scale;

  return {scale: scale, width: width, height: height};
}

export function getSize(trace, divider) {
  let width = Math.trunc(document.body.scrollWidth / divider - 20);
  let height = Math.trunc(document.body.scrollHeight / divider - 20);
  let scale = 1;
  if (trace !== null) {
    let h = Math.trunc(width * trace.height / trace.width);
    const hMax = document.body.scrollHeight - 100;
    if (h < hMax) {
      height = h;
    } else {
      height = hMax;
      width = Math.trunc(height * trace.width / trace.height);
    }
    scale = height / trace.height;
  }

  return {scale: scale, width: width, height: height};
}
