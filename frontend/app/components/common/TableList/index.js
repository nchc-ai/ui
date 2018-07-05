import React from 'react';
import _ from 'lodash';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import ToggleButton from 'react-toggle-button';
import MdMoreVert from 'react-icons/lib/md/more-vert';
import MdEdit from 'react-icons/lib/md/edit';
import MdDelete from 'react-icons/lib/md/delete';
import DataFrameTable from '../DataFrame/DataFrameTable';
import DialogWrapper from '../Dialog/index';

const TableList = ({ data, tableData, editMethod, deleteMethod }) => (
  <Table className="table-list-comp" hover>
    <thead>
      <tr>
        { tableData.headers.map(d => <th key={d.key}>{d.text}</th>)}
      </tr>
    </thead>
    <DataFrameTable
      data={data}
      cols={8}
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
                      <Link to={`/course/detail/${_.get(d, 'id')}`}>{_.get(d, datum.value)}</Link>
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
                      <button className="action-open-btn">
                        <MdMoreVert />
                      </button>
                      <ul className="action-menu">
                        <li>
                          <button className="action-btn" onClick={() => editMethod(d)}>
                            <span className="action-word">編輯</span>
                            <MdEdit />
                          </button>
                        </li>
                        <li>
                          <DialogWrapper
                            openButton={{
                              icon: <MdDelete />,
                              text: '刪除'
                            }}
                            submitButton={{
                              cancel: '取消',
                              confirm: '確定'
                            }}
                            initialModel={{ open: false }}
                            title={'刪除課程'}
                            confirmMethod={() => deleteMethod(d)}
                          >
                            <p>{`確定刪除 ${d.name} 這門課？`}</p>
                          </DialogWrapper>
                        </li>
                      </ul>
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
