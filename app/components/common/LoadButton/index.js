import React     from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spinner   from './Spinner';

const Button = styled.button`
  margin-right: 20px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  background-color: #2a9b9d;
  color: #fff;
  opacity: 0.8;
  outline: none;
  cursor: pointer;


  &:hover { opacity: 1; }
  &:active{
    opacity: 0.8;
    transform: translateY(4px);
    outline: none;
  }
`

const propTypes = {
  bsStyle:        PropTypes.string,
  children:       PropTypes.node,
  disabled:       PropTypes.bool,
  icon:           PropTypes.node,
  loading:        PropTypes.bool,
  spinColor:      PropTypes.string,
  spinAlignment:  PropTypes.string
};

function ButtonLoader({
  bsStyle   = 'default',
  children  = null,
  disabled  = false,
  icon      = null,
  loading   = false,
  spinColor = '#fff',
  spinAlignment = 'left',
  ...rest,
}) {
  function renderIcon() {
    if (loading) {
      return <Spinner spinColor={spinColor} spinAlignment={spinAlignment} />;
    }

    return icon;
  }

  const buttonDisabled = disabled || loading;

  return <Button bsStyle={bsStyle} disabled={buttonDisabled} {...rest}>{renderIcon()} {children}</Button>;
}

ButtonLoader.propTypes = propTypes;

export default ButtonLoader;

export { ButtonLoader, Spinner };