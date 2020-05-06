import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

function Random(props) {
  var maxNumber = 90;
  var randomNumber = Math.floor((Math.random() * maxNumber) + 1)
  return <div>{randomNumber}</div>;
}

ReactDOM.render(
  <Random />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
