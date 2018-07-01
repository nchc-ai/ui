import React from 'react';
import _ from 'lodash';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import ToggleButton from 'react-toggle-button';
import MdMoreVert from 'react-icons/lib/md/more-vert';
import DataFrameTable from '../DataFrame/DataFrameTable';

const TableList = ({ data, tableData }) => (
  <Table className="table-list-comp" hover>
    <thead>
      <tr>
        { tableData.headers.map(d => <th key={d.key}>{d.text}</th>)}
      </tr>
    </thead>
    <DataFrameTable
      data={data}
      cols={5}
    >
      {
        data.map((d, j) => (
          <tr key={j}>
            {
              tableData.cols.map((datum) => {
                switch (datum.type) {
                case 'link':
                  return (
                    <td key={datum.key}>
                      <Link to={`course/${_.get(d, 'id')}`}>{_.get(d, datum.value)}</Link>
                    </td>
                  );
                case 'level':
                  return (
                    <td key={datum.key}>
                      { _.get(d, datum.value, 'basic') === 'advance' ? '進階' : '基礎' }
                    </td>
                  );
                case 'date':
                  return (
                    <td key={datum.key}>
                      <Moment format="YYYY/MM/DD" date={_.get(d, datum.value)} />
                    </td>
                  );
                case 'more':
                  return (
                    <td key={datum.key}>
                      <MdMoreVert />
                    </td>
                  );
                case 'toggle':
                  return (
                    <td key={datum.key}>
                      <span className="fl">已關閉</span>
                      <div className="fl">
                        <ToggleButton
                          value={false}
                          thumbStyle={{ borderRadius: 2 }}
                          trackStyle={{ borderRadius: 2 }}
                        />
                      </div>
                    </td>
                  );
                default:
                  return <td key={datum.key}>{_.get(d, datum.value)}</td>;
                }
              })
            }
          </tr>
        ))
      }
    </DataFrameTable>
  </Table>
);

export default TableList;
