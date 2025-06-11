import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SafeApps from './pages/SafeApps';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/safeApps" element={<SafeApps />} />
    </Routes>
  );
}

// route URLs will look like #/safeApps

export default App;

