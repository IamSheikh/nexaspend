import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import 'react-toastify/dist/ReactToastify.css';
// import 'tailwindcss/tailwind.css';
import './styles/dist/dist.css';
import Main from './pages/Main';

export default function App() {
  const [refreshState, setRefreshState] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main setRefreshState={setRefreshState} />} />
        <Route
          path="/home"
          element={
            <Home
              refreshState={refreshState}
              setRefreshState={setRefreshState}
            />
          }
        />
      </Routes>
    </Router>
  );
}
