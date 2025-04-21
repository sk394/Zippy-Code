import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Questions from './Questions';
import Homepage from './Homepage';  // Homepage imported here
import LoginForm from './LoginForm';
import CreateQuestion from './CreateQuestion';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import ProtectedRoute from './Protected-Route';
import SelectRolePage from './Select-Role';
import EditQuestion from './EditQuestion';
import { Chat } from './Chat';
import QuestionDetails from './RunCode';
import WeeklyTopLeaderboard from './LeaderBoard';

function App() {
  const { user } = useUser();
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="bg-base-100 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/">
              <button className="btn btn-dash btn-accent">Home</button>
            </Link>
            <code className="font-semibold text-accent text-xl">Hello, {user?.unsafeMetadata?.role || "User"}!</code>
            <div className="flex space-x-4 justify-items-center">
              <Link to="/questions">
                <button className="btn btn-dash btn-accent">Questions</button>
              </Link>
              <SignedOut>
                <Link to="/login">
                  <button className="btn btn-accent">
                    Login
                  </button>
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </nav>
        {/* Routes */}
        <Routes>
          <Route path="/select-role" element={<SelectRolePage />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/questions" element={
            <ProtectedRoute>
              <Questions />
            </ProtectedRoute>}
          />
          <Route path="/questions/:id" element={
            <ProtectedRoute>
              <QuestionDetails />
            </ProtectedRoute>}
          />
          <Route path="/questions/:id/create-question" element={
            <ProtectedRoute isProfessor={true}>
              <CreateQuestion />
            </ProtectedRoute>}
          />
          <Route path="/questions/:id/edit" element={
            <ProtectedRoute isProfessor={true}>
              <EditQuestion />
            </ProtectedRoute>}
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
          <Route path="/weekly-top-10" element={
            <ProtectedRoute>
              <WeeklyTopLeaderboard />
            </ProtectedRoute>}
          />
        </Routes>

      </div >
    </Router >
  );
}

export default App;
