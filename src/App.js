import React from 'react';
import './App.css';
import List from './components/List';
import { BrowserRouter } from'react-router-dom';
import Router from 'rect-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
      <List />
    </div>
    </Router>
  );
}

export default App;
