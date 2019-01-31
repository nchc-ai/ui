const React = require('react')
const PropTypes = require('prop-types')
const CodeMirror = require('./Codemirror')

function Editor(props) {
  return (
    <div className="editor pure-form">
      <CodeMirror mode="markdown" theme="monokai" value={props.value} onChange={props.onChange} />
    </div>
  )
}

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
}

Editor.defaultProps = {
  value: ''
}

module.exports = Editor