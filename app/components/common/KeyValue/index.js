import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import { notify } from 'react-notify-toast';
import { TOAST_TIMING } from '../../../constants';

const Comp = styled.div`
  width: 510px;
  color: #fff;
`;

const Header = styled.section`
  height: 40px;
  padding: 0px 20px;
  line-height: 40px;
  background-color: #000;
`;

const Background = styled.div`
  background-color: #f8f4f4;
  text-align: center;
  padding: 20px 20px;
`;

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  display: inline-block;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  background-color: #fff;
  margin-bottom: 15px;
`;

const RowActive = styled(Row)`
  box-shadow: 2px 2px 7px 0 rgba(0, 0, 0, 0.21);
`;


const RowItem = styled.span`
  padding-left: 20px;
`;

const Input = styled.input`
  padding-left: 6px;
  border: 1px solid #979797;
  background-color: #fff;
  outline: none;
`;

const Label = styled.label`
  margin-bottom: 0px;
  color: #000;
  font-size: 14px;
`;

const LabelText = styled.span`
  font-size: 14px;
  padding-right: 10px;
`;

const Delete = styled.div`
  width: 20px;
  padding-left: 10px;
`;


const ButtonsGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Reset = styled.div`
  justify-self: flex-start;
`;

const Add = styled.div`
  justify-self: flex-end;
`;

const Button = styled.button`
  padding: 5px 15px;
  opacity: 0.8;
  outline: none;
  cursor: pointer;

  &:focus { outline:0; }
  &:hover { opacity: 1; }
  &:active{
    opacity: 0.8;
    transform: translateY(4px);
    outline: none;
  }
`

const AddButton = styled(Button)`
  background-color: #000;
  border-radius: 5px;
  color: #fff;
`;

const DeleteButton = styled(Button)`
  padding: 5px 5px;
`;

const c = 'key-value';

export default class KeyValue extends React.Component {
  static displayName = 'KeyValue'

  static propTypes = {
    onChange: PropTypes.func,
    customAddButtonRenderer: PropTypes.func,
    keyInputPlaceholder: PropTypes.string,
    valueInputPlaceholder: PropTypes.string,
    hideLabels: PropTypes.bool
  }

  static defaultProps = {
    rows: [],
    onChange: () => {},
    keyInputPlaceholder: '',
    valueInputPlaceholder: '',
    hideLabels: false
  }

  constructor(props) {
    super(props);
    this.state = {
      rows: [
        ...this.props.rows
      ],
      length: this.props.rows.length
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rows !== this.props.rows) {
      this.setState({
        rows: [
          ...nextProps.rows
        ]
      })
    }
  }

  handleAddNew = (event) => {
    event.preventDefault();


    const isEmptyValueExist = _.some(this.state.rows, (item) => _.isEmpty(item.keyItem) && _.isEmpty(item.valueItem));

    if (isEmptyValueExist) {
      notify.show("存取端口不應該有空資料喔", 'custom', TOAST_TIMING, { background: '#F7B216' });
    } else {
      this.setState({
        rows: [
          ...this.state.rows,
          {
            keyItem: '',
            valueItem: ''
          }
        ],
        length: this.state.rows.length
      }, () => {
        this.props.onChange([...this.state.rows]);
      });
    }
  }

  handleKeyItemChange(index, value) {
    this.setState({
      rows: this.state.rows.map((row, i) => {
        if (index !== i) {
          return row;
        }
        return {
          ...row,
          keyItem: value
        };
      })
    }, () => {
      this.props.onChange([...this.state.rows]);
    });
  }

  handleValueItemChange(index, value) {
    this.setState({
      rows: this.state.rows.map((row, i) => {
        if (index !== i) {
          return row;
        }
        return {
          ...row,
          valueItem: value
        };
      })
    }, () => {
      this.props.onChange([...this.state.rows]);
    });
  }

  handleRemove(event, index) {
    event.preventDefault();
      this.setState({
        rows: this.state.rows.filter((row, i) => i !== index)
      }, () => {
        this.props.onChange([...this.state.rows]);
      });
    if (index === 0) {
      notify.show("已清空存取端口資料", 'success', TOAST_TIMING);
    }
  }

  toJSON() {
    const { rows = [] } = this.state;
    return rows.reduce((acc, row) => {
      acc[row.keyItem] = row.valueItem;
      return acc;
    }, {});
  }

  renderLabelText(text) {
    if (this.props.hideLabels === true) {
      return null;
    }
    return (
      <LabelText>
        { text }
      </LabelText>
    );
  }

  renderKeyItem(index, value, keyText) {
    return (
      <Label>
        { this.renderLabelText(`${keyText}:`) }
        <Input
          type="text"
          value={ value }
          placeholder={ this.props.keyInputPlaceholder }
          onChange={ (e) => this.handleKeyItemChange(index, e.currentTarget.value) }
        />
      </Label>
    );
  }

  renderValueItem(index, value, valueText) {
    return (
      <Label>
        { this.renderLabelText(`${valueText}:`) }
        <Input
          type="text"
          value={ value }
          placeholder={ this.props.valueInputPlaceholder }
          onChange={ (e) => this.handleValueItemChange(index, e.currentTarget.value) }
        />
      </Label>
    );
  }

  renderRows({ keyText, valueText }) {
    return this.state.rows.map((row, i) => {
      const DynamicRow = i === this.state.length ? RowActive : Row;
      return (
        <DynamicRow
          key={ `key-value-row-${i}` }
          className={ `${c}-row` }
        >
          <RowItem className={ `${c}-row-key-item fl` }>
            { this.renderKeyItem(i, row.keyItem, keyText) }
          </RowItem>
          <RowItem className={ `${c}-row-value-item fl` }>
            { this.renderValueItem(i, row.valueItem, valueText) }
          </RowItem>
          <Delete className={ `${c}-row-remove fl` }>
            <DeleteButton
              onClick={ (e) => this.handleRemove(e, i) }
            >
              x
            </DeleteButton>
          </Delete>
        </DynamicRow>
      )
    });
  }

  renderResetButton({ resetText }) {
    if (typeof this.props.customAddButtonRenderer === 'function') {
      return this.props.customAddButtonRenderer(this.props.handleReset);
    }
    return (
      <Button
        onClick={ this.props.handleReset }
      >
        {resetText}
      </Button>
    );
  }

  renderAddButton({ addText }) {
    if (typeof this.props.customAddButtonRenderer === 'function') {
      return this.props.customAddButtonRenderer(this.handleAddNew);
    }
    return (
      <AddButton
        onClick={ (e) => this.handleAddNew(e) }
      >
        {addText}
      </AddButton>
    );
  }

  render() {

    const {
      config,
      isReset
    } = this.props;
    return (
      <Comp className={ c }>
        <Header>
          <span>
            {_.get(config, 'headerText')}
          </span>
        </Header>
        <Background>
          <Container>
            { this.renderRows(config) }
          </Container>
          <ButtonsGroup>
            {
              isReset ?
                <Reset>
                  { this.renderResetButton(config) }
                </Reset>
              :
                null
            }
            <Add>
              { this.renderAddButton(config) }
            </Add>
          </ButtonsGroup>
        </Background>
      </Comp>
    );
  }
}
