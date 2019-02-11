import React from 'react';
import _ from 'lodash';
import { Control, Errors } from 'react-redux-form';
import { Row, Col } from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import ReactQuill from 'react-quill';
import moment from 'moment';
import CronBuilder from  '../CronBuilder/index';
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
 * @param {Function} changeFileList - Special define for file input
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
  changeFileList,
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
      formData.map(template => (
        <Row key={template.key} className={`form-group form-group-${template.name}`}>
          <Col md={{ size: template.size || 12 }}>

            {/* 標題 */}
            <label
              className={`${template.isRequired ? 'required-label label' : 'label'} ${template.inputType === 'radio' ? 'radio-label-left' : ''} label-${template.name}`}
            >
              <span className="main-label">{template.mainLabel}</span>
              {template.viceLabel}
            </label>

            {/* 一般文字 */}
            {
              template.inputType === 'text'
              ?
                <div className="form-input">
                  <Control
                    type={template.inputType}
                    className={`input-${template.name} text-input`}
                    model={`.${template.name}`}
                    validators={template.validators}
                    placeholder={template.placeholder}
                    style={template.suffix ? { width: '90%' } : null}
                    disabled={template.isDisable}
                  />

                  {/* Material Design */}
                  <i className="bar" />
                  {template.suffix ? <span className="suffix-word">{template.suffix}</span> : null}
                </div>
              :
                null
            }

            {/* 密碼 */}
            {
              template.inputType === 'password'
              ?
                <div className="form-input">
                  <Control
                    type={template.inputType}
                    className={`input-${template.name} text-input`}
                    model={`.${template.name}`}
                    validators={template.validators}
                    placeholder={template.placeholder}
                    style={template.suffix ? { width: '90%' } : null}
                    disabled={template.isDisable}
                  />

                  {/* Material Design */}
                  <i className="bar" />
                  {template.suffix ? <span className="suffix-word">{template.suffix}</span> : null}
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
              template.inputType === 'radio'
              ?
                <div className="form-input-radio">
                  {
                    template.options.map(opt => (
                      <div key={opt.key} className={`radio-input-con ${template.className}`}>
                        <label
                          htmlFor={`radio-input-${opt.radioKey}`}
                          className="radio-label"
                        >
                          <input
                            id={`radio-input-${opt.radioKey}`}
                            type="radio"
                            className="radio-input"
                            value={opt.value}
                            checked={_.get(targetForm, `${template.name}.value`) === opt.value}
                            onChange={() => changeVal(opt, template.name, template.target)}
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
              template.inputType === 'date'
              ?
                <div className="form-input">
                  <DatePicker
                    selected={_.get(targetForm, template.name)}
                    onChange={val => changeVal(val, template.name, template.target)}
                    dateFormat="yyyy / MM / dd"
                  />
                </div>
              :
                null
            }


            {/* 大型寫字框 */}
            {
              template.inputType === 'textarea'
              ?
                <div className="form-input">
                  <Control.textarea
                    className={`input-${template.name} text-input`}
                    model={`.${template.name}`}
                    validators={template.validators}
                    placeholder={template.placeholder}
                    style={{ width: '400px', height: '200px', marginBottom: '40px' }}
                  />
                </div>
              :
                null
            }

            {/* 下拉式選單 */}
            {
              template.inputType === 'select'
              ?
              <div>
                <div className="form-input">
                  <Select
                    name="form-field-name"
                    value={_.get(targetForm, template.name)}
                    onChange={val => changeVal(val, template.name, template.target)}
                    options={template.options}
                    placeholder={template.placeholder}
                    searchable={false}
                    clearable={false}
                  />
                </div>
                <span className="fl">{template.unit || ''}</span>
              </div>
              :
                null
            }

            {/* Async下拉式選單 */}
            {
              template.inputType === 'async-select'
              ?
                <div className="form-input">
                  <Select.Async
                    name="form-field-name"
                    key={asyncSelectKey || ''}
                    value={_.get(targetForm, template.name)}
                    placeholder={template.placeholder}
                    onChange={val => changeVal(val, template.name, template.target)}
                    loadOptions={input => loadOptsMethod(input, template.name)}
                    clearable={false}
                    searchPromptText={template.promptText}
                    loadingPlaceholder={template.loadingText}
                  />
                </div>
              :
                null
            }

            {/* 一般多選 */}
            {
              template.inputType === 'tags-input'
              ?
                <div className="form-input">
                  <Select
                    name="form-field-name"
                    value={_.get(targetForm, template.name, [])}
                    placeholder={template.placeholder}
                    onChange={val => changeVal(val, template.name, template.target)}
                    options={template.options || []}
                    multi
                  />
                </div>
              :
                null
            }

            {/* Async 多選 */}
            {
              template.inputType === 'async-tags-input'
              ?
                <div className="form-input">
                  <Select.Async
                    name="form-field-name"
                    value={_.get(targetForm, template.name, [])}
                    placeholder={template.placeholder}
                    onChange={val => changeVal(val, template.name, template.target)}
                    loadOptions={input => loadTagsOptsMethod(input)}
                    multi
                  />
                </div>
              :
                null
            }

            {/* cron 輸入 */}
            {
              template.inputType === 'cron-input'
              ?
                <CronBuilder
                  onChange={val => changeVal(val, template.name, template.target)}
                />
              :
                null
            }

            {/* [副input] 下拉式input*/}
            {
              template.subSelect
              ?
                <div className="select-container">
                  <Select.Async
                    name="form-field-name"
                    value={_.get(targetForm, template.subSelect.name)}
                    placeholder={template.subSelect.placeholder}
                    onChange={val => changeVal(val, template.subSelect.name)}
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
              template.inputType === 'markdown'
              ?
                <div className="form-input">
                  <MarkdownEditor
                    value={_.get(targetForm, template.name)}
                    onChange={val => changeVal(val, template.name, template.target)}
                  />
                  {/* <MarkdownEditor /> */}

                  {/* <ReactQuill
                    value={_.get(targetForm, template.name)}
                    onChange={val => changeVal(val, template.name, template.target)}
                  /> */}
                  {/* <ReactMarkdown source={_.get(targetForm, template.name)} /> */}
                  {/* <MarkdownBlock /> */}
                  {/* <MarkdownShortcuts
                    value={_.get(targetForm, template.name)}
                    onMdChange={val => changeVal(val, template.name, template.target)}
                  /> */}
                </div>
              :
                null
            }

            {/* Quill格式 */}
            {
              template.inputType === 'html'
              ?
                <div className="form-input form-group-textarea">
                  <ReactQuill
                    value={state[template.name]}
                    onChange={content => changeVal(content, template.name)}
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
              template.inputType === 'keyValue'
              ?
              <div className="form-input form-group-key-value">
                <KeyValue
                  rows={_.get(targetForm, template.name)}
                  onChange={content => changeVal(content, template.name, template.target)}
                  config={template.config}
                />
              </div>
              :
                null
            }

            {/* File */}
            {
              template.inputType === 'file'
              ?
              <div className="form-input form-group-csv">
                <FileUpload
                  onListChange={content => changeFileList(content, template.name, template.target)}/>
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
              model={`.${template.name}`}
              show={field => field.touched && !field.focus}
              messages={template.errorMessage}
            />
          </Col>
        </Row>
      ))
    }
  </div>
)};

export default FormGroups;
