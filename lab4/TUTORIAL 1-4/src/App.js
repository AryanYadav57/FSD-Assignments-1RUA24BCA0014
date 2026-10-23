import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WebDevApp from './WebDevApp';
import Register from './pages/Register';
import SelectCategory from './pages/SelectCategory';
import Home from './pages/Home';
import Browse from './pages/Browse';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mount the original application at the root */}
        <Route path="/*" element={<WebDevApp />} />
        
        {/* Mount the new Capstone Super App under /superapp */}
        <Route path="/superapp" element={<Navigate to="/superapp/register" />} />
        <Route path="/superapp/register" element={<Register />} />
        <Route path="/superapp/select-category" element={<SelectCategory />} />
        <Route path="/superapp/home" element={<Home />} />
        <Route path="/superapp/browse" element={<Browse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
