import './App.css';
import Main from './main2';
import { BrowserRouter as Router,Routes,Route,Link} from 'react-router-dom';
import About from './About';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
