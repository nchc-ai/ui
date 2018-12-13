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
              tableData.cols.map((datum) => (
                <td key={datum.key}>
                    {
                      datum.type === 'link' ?
                        <div>
                          <Link to={`${prefixUrl ? prefixUrl : `/user/ongoing-course/detail/`}${_.get(d, 'id')}`}>
                            {_.get(d, datum.value)}
                          </Link>
                        </div>
                      :
                        null
                    }

                    {
                      datum.type === 'level' ?
                        <div>
                          { _.get(d, datum.value, 'basic') === 'advance' ? '進階' : '基礎' }
                        </div>
                      :
                        null
                    }

                    {
                      datum.type === 'bool' ?
                        <div>
                          { _.get(d, datum.value, false) ? '是' : '否' }
                        </div>
                      :
                        null
                    }

                    {
                      datum.type === 'date' ?
                        <div>
                          <Moment format="YYYY/MM/DD" date={_.get(d, datum.value)} />
                        </div>
                      :
                        null
                    }
                    {
                      datum.type === 'start' ?
                        <div>
                          <button className="btn-start" onClick={e => startMethod(e, d)}>
                            {_.get(d, datum.text)}
                          </button>
                        </div>
                      :
                        null
                    }
                    {
                      datum.type === 'actions' ?
                        <div>
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
                        </div>
                      :
                      null
                    }
                  </td>
              ))
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
