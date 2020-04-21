import React, { Component } from 'react';
import logo from '/opt/app/src/logo.svg';
import '/opt/app/src/App.css';
import axios from 'axios';

class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          brutto: 0,
          result23: 0,
          result22: 0,
          result8: 0,
          result7: 0,
          result5: 0,
          result3: 0
         };
      }

      myChangeHandler = (event) => {
        axios.get('/api/'+event.target.value)
        .then(response => {
          console.log(response);
          this.setState({
            result23: response.data.result23,
            result22: response.data.result22,
            result8: response.data.result8,
            result7: response.data.result7,
            result5: response.data.result5,
            result3: response.data.result3,
          });
        })
      }

      render() {
        return (
          <form>
            <h4>WPISZ KWOTĘ NETTO</h4>
          <input
            type='number'
            onChange={this.myChangeHandler}
          />
          <p>23%: {this.state.result23}</p>
          <p>22%: {this.state.result22}</p>
          <p>8%: {this.state.result8}</p>
          <p>7%: {this.state.result7}</p>
          <p>5%: {this.state.result5}</p>
          <p>3%: {this.state.result3}</p>
          </form>
        );
      }
}

export default Calculator