import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";

const info = [
  {id: "signup", title:"Sign up",info:"Sign up here"}
]
ReactDOM.render(<App info={info} />, document.getElementById('root'));



const AppWithRouter = () => {
  return (
    <Router>
      <App/>
    </Router>
  );
};
ReactDOM.render(<AppWithRouter />, document.getElementById("root"));
