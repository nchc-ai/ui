import React from 'react';
import _ from 'lodash';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import ToggleButton from 'react-toggle-button';
import { MdMoreVert, MdAdd, MdEdit, MdDelete } from "react-icons/md";
import DataFrameTable from '../DataFrame/DataFrameTable';
import DialogWrapper from '../Dialog/index';

const TableList = ({ prefixUrl, data, tableData, isDialogOpen, startMethod, editMethod, deleteMethod, addJob, isLoading, actionMode }) => (
  <Table className="table-list-comp" hover>
    <thead>
      <tr>
        { tableData.headers.map(d => <th key={d.key}>{d.text}</th>)}
      </tr>
    </thead>
    <DataFrameTable
      isLoading={isLoading}
      data={data}
      cols={8}
    >
      {
        data.map((d, j) => (
          <tr key={j}>
            {
              tableData.cols.map((template) => (
                <td key={template.key}>
                    {
                      template.type === 'link-detail' ?
                        <div>
                          {
                            _.get(template, 'isLinkDisabled', false) ?
                              <span>{_.get(d, template.value)}</span>
                            :
                              <Link to={`${prefixUrl ? prefixUrl : `/user/ongoing-course/detail/`}${_.get(d, 'id')}/${_.get(d, 'type', "").toLowerCase()}`}>
                                {_.get(d, template.value)}
                              </Link>
                          }
                        </div>
                      :
                        null
                    }

                    {
                      template.type === 'link-edit' ?
                        <div>
                          <Link to={`${prefixUrl ? prefixUrl : `/user/ongoing-course/edit/`}${_.get(d, 'id')}/${_.get(d, 'type', "").toLowerCase()}`}>
                            {_.get(d, template.value)}
                          </Link>
                        </div>
                      :
                        null
                    }

                    {
                      template.type === 'level' ?
                        <div>
                          { _.get(d, template.value, 'basic') === 'advance' ? '進階' : '基礎' }
                        </div>
                      :
                        null
                    }

                    {
                      template.type === 'boolean' ?
                        <div>
                          { _.get(d, template.value, false) === (_.get(template, 'custom.positive') || true) ?
                              `${_.get(template, 'custom.trueText', '是')}`
                            :
                              `${_.get(template, 'custom.falseText', '否')}`
                          }
                        </div>
                      :
                        null
                    }
                    {
                      template.type === 'multi-select' ?
                        <div>
                          {
                            _.get(d, template.value, []).length > 0 ?
                              d[template.value].map((datum, index) => (
                                <p key={`array-${index}`}>{_.get(datum, "label", '')}</p>
                              ))
                            : <div>尚無資料</div>
                          }
                        </div>
                      : null
                    }
                    {
                      template.type === 'array' ?
                        <div>
                          {_.get(d, template.value, []).map((arrItem, arrItemKey) => <p key={arrItemKey}>{arrItem}</p>)}
                        </div>
                      :
                        null
                    }
                    {
                      template.type === 'date' ?
                        <div>
                          <Moment format="YYYY / MM / DD" date={_.get(d, template.value)} />
                        </div>
                      :
                        null
                    }
                    {
                      template.type === 'start' ?
                        <div>
                          <button className="btn-start" onClick={e => startMethod(e, d)}>
                            {_.get(d, template.text)}
                          </button>
                        </div>
                      :
                        null
                    }
                    {
                      template.type === 'actions' ?
                        <div>
                          {
                              <button className="action-open-btn">
                                <MdMoreVert />
                              </button>
                          }
                          <ul className="action-menu">
                            {
                              actionMode === 'start_only' || actionMode === 'full' ?
                              <li>
                                <button className="action-btn" onClick={e => startMethod(e, d)}>
                                  <span className="action-word">開始</span>
                                  <MdAdd />
                                </button>
                              </li> : null
                            }

                            {
                              actionMode === 'edit_only' || actionMode === 'edit_delete' || actionMode === 'full'?
                              <li>
                                <button className="action-btn" onClick={e => editMethod(e, d)}>
                                  <span className="action-word">編輯</span>
                                  <MdEdit />
                                </button>
                              </li> : null
                            }

                            {
                              actionMode === 'delete_only' || actionMode === 'edit_delete' || actionMode === 'full'?
                              <li>
                                <button className="action-btn" onClick={e => deleteMethod(e, d)}>
                                  <span className="action-word">刪除</span>
                                  <MdDelete />
                                </button>
                              </li> : null
                            }
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
