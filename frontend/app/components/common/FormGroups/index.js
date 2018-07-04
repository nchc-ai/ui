import React from 'react';
import _ from 'lodash';
import { Control, Errors } from 'react-redux-form';
import { Row, Col } from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import ReactQuill from 'react-quill';
import moment from 'moment';
import MarkdownShortcuts from '../MarkdownShortcuts/index';
// import * as options from '../../constants/options';

// 不要包Form進來比較有彈性，拿來組合用
// 另外也不要寫changeVal函式，保持pure
const FormGroups = ({
  formData,
  targetForm,
  state,
  size,
  changeVal,
  loadOptsMethod,
  loadTagsOptsMethod,
  onRadioChange,
  onDateChange,
  onMdChange,
}) => (
  <Row>
    {
      formData.map(d => (
        <Col key={d.key} className={`form-group form-group-${d.name}`} md={{ size: size || 12 }}>

          {/* 標題 */}
          <label
            className={`${d.isRequired ? 'required-label label' : 'label'} ${d.inputType === 'radio' ? 'radio-label-left' : ''} label-${d.name}`}
          >
            <span className="main-label">{d.mainLabel}</span>
            {d.viceLabel}
          </label>

          {/* [input] 單選radio */}
          {
            d.inputType === 'radio'
            ?
              <div className="form-input-radio">
                {
                  d.radioArr.map(opt => (
                    <div key={opt.key} className={`radio-input-con ${d.className}`}>
                      <label
                        htmlFor={`radio-input-${opt.key}`}
                        className="radio-label"
                      >
                        <input
                          id={`radio-input-${opt.key}`}
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

          {/* [input] 日期格式 */}
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

          {/* [input] 一般文字 */}
          {
            d.inputType === 'text' || d.inputType === 'password'
            ?
              <div className="form-input">
                <Control
                  type={d.inputType}
                  className={`input-${d.name} text-input`}
                  model={`.${d.name}`}
                  validators={d.validators}
                  placeholder={d.placeholder}
                  style={d.suffix ? { width: '90%' } : null}
                />

                {/* Material Design */}
                <i className="bar" />
                {d.suffix ? <span className="suffix-word">{d.suffix}</span> : null}
              </div>
            :
              null
          }

          {/* [input] 大型寫字框 */}
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

          {/* [input] 下拉式選單 */}
          {
            d.inputType === 'select'
            ?
              <div className="form-input">
                <Select
                  name="form-field-name"
                  value={_.get(targetForm, d.name)}
                  onChange={val => changeVal(val, d.name, d.target)}
                  options={d.options}
                  searchable={false}
                  clearable={false}
                />
              </div>
            :
              null
          }

          {/* [input] Async下拉式選單 */}
          {
            d.inputType === 'async-select'
            ?
              <div className="form-input">
                <Select.Async
                  name="form-field-name"
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

          {/* [input] Async 多選 */}
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
          
          {/* [input] Markdown */}
          {
            d.inputType === 'markdown'
            ?
              <div className="form-input">
                <MarkdownShortcuts
                  onMdChange={val => changeVal(val, d.name, d.target)}
                />
              </div>
            :
              null
          }

          {/* [input] Quill格式 */}
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
      ))
    }
  </Row>
);

export default FormGroups;
