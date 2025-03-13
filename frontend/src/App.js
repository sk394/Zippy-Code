import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Questions from './Questions';
import QuestionDetails from './QuestionDetails';
import Homepage from './Homepage';  // Homepage imported here
import LoginForm from './LoginForm';

function App() {
  return (
    <Router>
      <div className="App bg-base-200 min-h-screen">
        {/* Navigation Bar */}
        <nav className="bg-base-100 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/">
              <button className="btn btn-accent">Home</button>
            </Link>
            <div className="space-x-4">
              <Link to="/questions">
                <button className="btn btn-accent">Questions</button>
              </Link>
              <Link to="/login">
                <button className="btn btn-accent">Login</button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto p-4">
          <Routes>
            {/* Home route, displays Homepage */}
            <Route path="/" element={<Homepage />} /> 
            
            {/* Route for questions */}
            <Route path="/questions" element={<Questions />} />

            {/* Route for question details, with dynamic param */}
            <Route path="/questions/:id" element={<QuestionDetails />} />

            {/* Route for Login Form */}
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
