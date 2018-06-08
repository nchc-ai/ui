import React, {Component} from 'react';
import './App.css';
import axios from 'axios'


class App extends Component {

  constructor() {
    super()
    this.state = {
      message: '',
      replica: '1',
      msg: 'shit world!!!'
    }

    this.handleClick1 = this.handleClick1.bind(this)
    this.handleClick2 = this.handleClick2.bind(this)
    this.handleClick3 = this.handleClick3.bind(this)
    this.handleClick4 = this.handleClick4.bind(this)
    this.updateInput = this.updateInput.bind(this);
    this.updateInput1 = this.updateInput1.bind(this);

  }


  handleClick1() {
    axios.get('/getPod')
      .then(response => this.setState({message: response.data.message}))
  }


  handleClick2() {
    axios.get('/getWorkflow')
      .then(response => this.setState({message: response.data.message}))
  }

  handleClick3() {
    axios.post(
      '/createDeploy',
      {
        replica: parseInt(this.state.replica)
      })
      .then(response => this.setState({message: response.data.message}))
  }

  handleClick4() {
    axios.post(
      '/createWorkflow',
      {
        message: this.state.msg
      })
      .then(response => this.setState({message: response.data.message}))
  }

  updateInput(event) {
    this.setState({replica: event.target.value})
  }

  updateInput1(event) {
    this.setState({msg: event.target.value})
  }

  render() {
    return (
      <div className="App">

        <input type="text" onChange={this.updateInput}></input>
        <button onClick={this.handleClick3}>create deployment</button>
        <button onClick={this.handleClick1}>get deployment replica</button>
        <br/>

        <input type="text1" onChange={this.updateInput1}></input>
        <button onClick={this.handleClick4}>create workflow</button>
        <button onClick={this.handleClick2}>get workflow number</button>

        <p>{this.state.message}</p>

      </div>
    );
  }
}

export default App;
