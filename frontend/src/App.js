import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Questions from './Questions';
import QuestionDetails from './QuestionDetails';

function App() {
  return (
    <Router>
    <div className="App">
      <nav className="space-x-2 mt-2 mb-2">
        <Link to="/"><button className="btn btn-dash btn-accent">Home</button></Link>
        <Link to="/questions"><button className="btn btn-dash btn-accent">Questions</button></Link>   
      </nav>
      <Routes>
        <Route path ="/" element={<div className="w-full">Login Page Here</div>} />
        <Route path = "/questions" element = {<Questions />} />
        <Route path = "/questions/:id" element = { <QuestionDetails />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
