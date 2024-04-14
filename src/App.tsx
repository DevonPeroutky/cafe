import React from 'react';
import {Roast} from "@/pages/roast.tsx";
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Therapize} from "@/pages/therapize.tsx";
import {Therapy} from "@/pages/therapy.tsx";


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" Component={Roast} />
          <Route path="/roast" Component={Roast} />
          <Route path="/therapize" Component={Therapize} />
          <Route path="/therapy" Component={Therapy} />
        </Routes>
      </Router>
  );
}


export default App;
