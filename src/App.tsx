import React from 'react';
import {Roast} from "@/pages/roast.tsx";
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Therapize} from "@/pages/therapize.tsx";


function App() {
  return (
      <Router>
        <Routes>
          <Route exact path="/" Component={Roast} />
          <Route path="/roast" Component={Roast} />
          <Route path="/therapize" Component={Therapize} />
        </Routes>
      </Router>
  );
}


export default App;
