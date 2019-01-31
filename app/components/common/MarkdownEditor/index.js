import * as React from "react";
import ReactMde from 'react-mde';
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import "draft-js/dist/Draft.css";

class MarkdownEditor extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      value: "**Hello world!!!**"
    };
    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });
  }

  handleValueChange = (value) => {
    this.setState({ value });
  };

  render () {
    const {
      value,
      onChange
    } = this.props;

    return (
      <div className="container">
        <ReactMde
          onChange={onChange}
          value={value}
          buttonContentOptions={{
              iconProvider: name => <i className={`fa fa-${name}`} />,
          }}
          generateMarkdownPreview={markdown =>
            Promise.resolve(this.converter.makeHtml(markdown))
          }
        />
      </div>
    );
  }
}

export default MarkdownEditor;