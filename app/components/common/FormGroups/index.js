import React from 'react';
import _ from 'lodash';
import { Control, Errors } from 'react-redux-form';
import { Row, Col } from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import ReactQuill from 'react-quill';
import moment from 'moment';
import CronBuilder from  '../../../vendor/CronBuilder';
import FileUpload from '../FileUpload/index';
import MarkdownEditor from '../MarkdownEditor/index';
import KeyValue from '../KeyValue/index';
// import * as options from '../../constants/options';

// 不要包Form進來比較有彈性，拿來組合用
// 請不要重複同個type兩次以上，如遇此狀況請分兩個FormGroups用
// 另外也不要寫changeVal函式，保持pure

/**
 * @param {Array} formData Template array for multi type.
 * @param {Array} targetForm Template array for multi type.
 * @param {Array} state For slate input.
 * @param {Array} asyncSelectKey
 * @param {Function} changeVal
 * @param {Function} loadOptsMethod
 * @param {Function} loadTagsOptsMethod
 * @param {Function} onDateChange
 * @param {Function} onMdChange
 * @param {Function} onFileChange Select file as a sub object in event target
 * @param {Function} handleUpload Upload selected file.
 *
 * 1. text 一般文字
 * 2. 密碼
 * 3. 單選radio
 * 4. 日期格式
 * 5. 大型寫字框
 * 6. 下拉式選單
 * 7. Async下拉式選單
 * 8. Async 多選
 * 9. cron 輸入
 * 10. sub 下拉式input
 * 11. Markdown
 * 12. Quill格式
 * 13. keyValue
 * 14. File
 * - Hint
 */

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em'
  }
};

const FormGroups = ({
  formData,
  targetForm,
  state,
  asyncSelectKey,
  changeVal,
  loadOptsMethod,
  loadTagsOptsMethod,
  onDateChange,
  onMdChange,
  onFileChange,
  handleUpload
}) => {

  return (
  <div className="form-groups-comp">
    {
      formData.map(d => (
        <Row key={d.key} className={`form-group form-group-${d.name}`}>
          <Col md={{ size: d.size || 12 }}>

            {/* 標題 */}
            <label
              className={`${d.isRequired ? 'required-label label' : 'label'} ${d.inputType === 'radio' ? 'radio-label-left' : ''} label-${d.name}`}
            >
              <span className="main-label">{d.mainLabel}</span>
              {d.viceLabel}
            </label>

            {/* 一般文字 */}
            {
              d.inputType === 'text'
              ?
                <div className="form-input">
                  <Control
                    type={d.inputType}
                    className={`input-${d.name} text-input`}
                    model={`.${d.name}`}
                    validators={d.validators}
                    placeholder={d.placeholder}
                    style={d.suffix ? { width: '90%' } : null}
                    disabled={d.isDisable}
                  />

                  {/* Material Design */}
                  <i className="bar" />
                  {d.suffix ? <span className="suffix-word">{d.suffix}</span> : null}
                </div>
              :
                null
            }

            {/* 密碼 */}
            {
              d.inputType === 'password'
              ?
                <div className="form-input">
                  <Control
                    type={d.inputType}
                    className={`input-${d.name} text-input`}
                    model={`.${d.name}`}
                    validators={d.validators}
                    placeholder={d.placeholder}
                    style={d.suffix ? { width: '90%' } : null}
                    disabled={d.isDisable}
                  />

                  {/* Material Design */}
                  <i className="bar" />
                  {d.suffix ? <span className="suffix-word">{d.suffix}</span> : null}
                </div>
              :
                null
            }


            {/**
              *  Radio input
              *    - radioKey {String} Each unique key in "same" from, radio only
              *
              */}
            {
              d.inputType === 'radio'
              ?
                <div className="form-input-radio">
                  {
                    d.options.map(opt => (
                      <div key={opt.key} className={`radio-input-con ${d.className}`}>
                        <label
                          htmlFor={`radio-input-${opt.radioKey}`}
                          className="radio-label"
                        >
                          <input
                            id={`radio-input-${opt.radioKey}`}
                            type="radio"
                            className="radio-input"
                            value={opt.value}
                            checked={_.get(targetForm, `${d.name}.value`) === opt.value}
                            onChange={() => changeVal(opt, d.name, d.target)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      </div>
                    ))
                  }
                </div>
              :
                null
            }

            {/* 日期格式 */}
            {
              d.inputType === 'date'
              ?
                <div className="form-input">
                  <DatePicker
                    selected={moment(targetForm.birthday)}
                    onChange={e => onDateChange(e)}
                    dateFormat="YYYY / MM / DD"
                  />
                </div>
              :
                null
            }


            {/* 大型寫字框 */}
            {
              d.inputType === 'textarea'
              ?
                <div className="form-input">
                  <Control.textarea
                    className={`input-${d.name} text-input`}
                    model={`.${d.name}`}
                    validators={d.validators}
                    placeholder={d.placeholder}
                    style={{ width: '400px', height: '200px', marginBottom: '40px' }}
                  />
                </div>
              :
                null
            }

            {/* 下拉式選單 */}
            {
              d.inputType === 'select'
              ?
              <div>
                <div className="form-input">
                  <Select
                    name="form-field-name"
                    value={_.get(targetForm, d.name)}
                    onChange={val => changeVal(val, d.name, d.target)}
                    options={d.options}
                    placeholder={d.placeholder}
                    searchable={false}
                    clearable={false}
                  />
                </div>
                <span className="fl">{d.unit || ''}</span>
              </div>
              :
                null
            }

            {/* Async下拉式選單 */}
            {
              d.inputType === 'async-select'
              ?
                <div className="form-input">
                  <Select.Async
                    name="form-field-name"
                    key={asyncSelectKey || ''}
                    value={_.get(targetForm, d.name)}
                    placeholder={d.placeholder}
                    onChange={val => changeVal(val, d.name, d.target)}
                    loadOptions={input => loadOptsMethod(input, d.name)}
                    clearable={false}
                    searchPromptText={d.promptText}
                    loadingPlaceholder={d.loadingText}
                  />
                </div>
              :
                null
            }

            {/* Async 多選 */}
            {
              d.inputType === 'tags-input'
              ?
                <div className="form-input">
                  <Select.Async
                    name="form-field-name"
                    multi
                    value={_.get(targetForm, d.name)}
                    placeholder={d.placeholder}
                    onChange={val => changeVal(val, d.name, d.target)}
                    loadOptions={input => loadTagsOptsMethod(input)}
                  />
                </div>
              :
                null
            }

            {/* cron 輸入 */}
            {
              d.inputType === 'cron-input'
              ?
                <CronBuilder
                  cronExpression="* * * * * *"
                  onChange={val => changeVal(val, d.name, d.target)}
                  showResult
                />
              :
                null
            }

            {/* [副input] 下拉式input*/}
            {
              d.subSelect
              ?
                <div className="select-container">
                  <Select.Async
                    name="form-field-name"
                    value={_.get(targetForm, d.subSelect.name)}
                    placeholder={d.subSelect.placeholder}
                    onChange={val => changeVal(val, d.subSelect.name)}
                    loadOptions={input => loadOptsMethod(input)}
                    clearable={false}
                    searchPromptText="請輸入郵遞區號搜尋"
                    loadingPlaceholder="尋找中..."
                  />
                </div>
              :
              null
            }

            {/* Markdown */}
            {
              d.inputType === 'markdown'
              ?
                <div className="form-input">
                  <MarkdownEditor
                    value={_.get(targetForm, d.name)}
                    onChange={val => changeVal(val, d.name, d.target)}
                  />
                  {/* <MarkdownEditor /> */}

                  {/* <ReactQuill
                    value={_.get(targetForm, d.name)}
                    onChange={val => changeVal(val, d.name, d.target)}
                  /> */}
                  {/* <ReactMarkdown source={_.get(targetForm, d.name)} /> */}
                  {/* <MarkdownBlock /> */}
                  {/* <MarkdownShortcuts
                    value={_.get(targetForm, d.name)}
                    onMdChange={val => changeVal(val, d.name, d.target)}
                  /> */}
                </div>
              :
                null
            }

            {/* Quill格式 */}
            {
              d.inputType === 'html'
              ?
                <div className="form-input form-group-textarea">
                  <ReactQuill
                    value={state[d.name]}
                    onChange={content => changeVal(content, d.name)}
                  />
                </div>
              :
                null
            }

            {/**
              *  KeyValue input
              *  - rows {Array} Initial datasets.
              *  - customAddButtonRenderer {Function} Return template of button.
              *  - onChange {Function} Triggered when input changed.
              *  - hideLabels {Boolean} Hide label or not.
              */}
            {
              d.inputType === 'keyValue'
              ?
              <div className="form-input form-group-key-value">
                <KeyValue
                  rows={_.get(targetForm, d.name)}
                  onChange={content => changeVal(content, d.name, d.target)}
                  config={d.config}
                />
              </div>
              :
                null
            }

            {/* File */}
            {
              d.inputType === 'file'
              ?
              <div className="form-input form-group-csv">
                <FileUpload onListChange={content => changeVal(content, d.name, d.target)}/>
              </div>
              :
                null
            }

            {/* 錯誤Hint */}
            <Errors
              wrapper={
                props =>
                  <div className="errors">
                    {props.children}
                  </div>
              }
              model={`.${d.name}`}
              show={field => field.touched && !field.focus}
              messages={d.errorMessage}
            />
          </Col>
        </Row>
      ))
    }
  </div>
)};

export default FormGroups;
