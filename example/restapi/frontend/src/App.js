import React, {Component} from 'react';
import './App.css';
import axios from 'axios'


class App extends Component {

  constructor() {
    super()
    this.state = {
      message: ''
    }

    this.handleClick1 = this.handleClick1.bind(this)
    this.handleClick2 = this.handleClick2.bind(this)
    this.handleClick3 = this.handleClick3.bind(this)
    this.handleClick4 = this.handleClick4.bind(this)
  }


  handleClick1() {
    axios.get('http://127.0.0.1:8080/getPod')
      .then(response => this.setState({message: response.data.message}))
  }


  handleClick2() {
    axios.get('http://127.0.0.1:8080/getWorkflow')
      .then(response => this.setState({message: response.data.message}))
  }

  handleClick3() {

    axios.post(
      'http://127.0.0.1:8080/createDeploy',
      {
        replica: 3
      })
      .then(response => this.setState({message: response.data.message}))


  }

  handleClick4() {
    axios.post(
      'http://127.0.0.1:8080/createWorkflow',
      {
        message: "shit world!!!"
      })
      .then(response => this.setState({message: response.data.message}))
  }


  render() {
    return (
      <div className="App">

        <button onClick={this.handleClick3}>create deployment</button>
        <button onClick={this.handleClick1}>get deployment replica</button>
        <button onClick={this.handleClick4}>create workflow</button>
        <button onClick={this.handleClick2}>get workflow number</button>

        <p>{this.state.message}</p>

      </div>
    );
  }
}

export default App;
