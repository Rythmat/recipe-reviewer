import { useState } from 'react';
import { Routes, Route} from 'react-router-dom';

function App() {
  return (
    <>
      <h1>Home</h1>

      <Routes>
      <Route path='/' element={<Home />}/>
      </Routes>
    </>
  )
}

export default App
