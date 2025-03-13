import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Questions from './Questions';
import QuestionDetails from './QuestionDetails';
import Homepage from './Homepage';  // Homepage imported here
import LoginForm from './LoginForm';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="bg-base-100 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/">
              <button className="btn btn-dash btn-accent">Home</button>
            </Link>
            <code className="font-semibold text-accent text-xl">Hello, Suman</code>
            <div className="space-x-4">
              <Link to="/questions">
                <button className="btn btn-dash btn-accent">Questions</button>
              </Link>
              <Link to="/login">
                <button className="btn btn-accent">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </nav>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/:id" element={<QuestionDetails />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
