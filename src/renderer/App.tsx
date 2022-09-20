import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home/index';
import Theme from './Theme/index';
import Settings from './Settings/index';

export default function App() {
  return (
    <Theme>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </Theme>
  );
}
