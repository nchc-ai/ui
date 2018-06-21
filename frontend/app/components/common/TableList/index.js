import React from 'react';
import _ from 'lodash';
import { Table } from 'reactstrap';

const TableList = ({ data, tableData }) => (
  <Table className="table-list-comp" hover>
    <thead>
      <tr>
        { tableData.header.map(d => <th key={d.key}>{d.text}</th>)}</tr>
    </thead>
    <tbody>
      {
        data.map((d, j) => (
          <tr key={j}>
            {
              tableData.row.map(datum => (
                <td key={datum.key}>{_.get(d, datum.text)}</td>
              ))
            }
          </tr>
        ))
      }
    </tbody>
  </Table>
);

export default TableList;
