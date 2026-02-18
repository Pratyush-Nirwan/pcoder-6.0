import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Pages/Home'
import About from './components/Pages/About'
import Works from './components/Pages/Works'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="works" element={<Works />} />
        </Route>
      </Routes>
    </BrowserRouter >
  )
}

export default App
