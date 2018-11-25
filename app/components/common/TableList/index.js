import React from 'react';
import _ from 'lodash';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import ToggleButton from 'react-toggle-button';
import { MdMoreVert, MdAdd, MdEdit, MdDelete } from "react-icons/md";
import DataFrameTable from '../DataFrame/DataFrameTable';
import DialogWrapper from '../Dialog/index';

const TableList = ({ prefixUrl, data, tableData, isDialogOpen, startMethod, editMethod, deleteMethod, isAdmin, addJob }) => (
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
                      <Link to={`${prefixUrl ? prefixUrl : `/course/detail/`}${_.get(d, 'id')}`}>{_.get(d, datum.value)}</Link>
                    </td>
                  );
                case 'level':
                  return (
                    <td key={datum.key}>
                      { _.get(d, datum.value, 'basic') === 'advance' ? '進階' : '基礎' }
                    </td>
                  );
                case 'bool':
                  return (
                    <td key={datum.key}>
                      { _.get(d, datum.value, false) ? '是' : '否' }
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
                      {
                        isAdmin ?
                          <button className="action-open-btn">
                            <MdMoreVert />
                          </button>
                        :
                          <button className="btn-student" onClick={e => startMethod(e, d)}> 開始課程 </button>
                      }
                      <ul className="action-menu">
                        <li>
                          <button className="action-btn" onClick={e => startMethod(e, d)}>
                            <span className="action-word">開始</span>
                            <MdAdd />
                          </button>
                        </li>
                        <li>
                          <button className="action-btn" onClick={() => editMethod(d)}>
                            <span className="action-word">編輯</span>
                            <MdEdit />
                          </button>
                        </li>
                        <li>
                          <button className="action-btn" onClick={() => deleteMethod(d)}>
                            <span className="action-word">刪除</span>
                            <MdDelete />
                          </button>
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

/*
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
  open={isDialogOpen}
>
  <p>{`確定刪除 ${d.name} 這門課？`}</p>
</DialogWrapper>

*/
