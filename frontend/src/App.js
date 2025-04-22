import { Link, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Questions from "./Questions";
import Homepage from "./Homepage";
import LoginForm from "./LoginForm";
import CreateQuestion from "./CreateQuestion";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import ProtectedRoute from "./Protected-Route";
import SelectRolePage from "./Select-Role";
import EditQuestion from "./EditQuestion";
import { Chat } from "./Chat";
import QuestionDetails from "./RunCode";
import WeeklyTopLeaderboard from "./LeaderBoard";
import { CodeXml, Zap } from "lucide-react";
import { useEffect, useState } from "react";

function App() {
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Change to true when scrolled down more than 50px
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <Router>
      <div className="App">
        <header className={`app-header  ${scrolled ? 'scrolled bg-gradient-to-b from-gray-900 to-gray-800' : ''}`}>
          <div className="app-container">
            <div className="logo">
              <Link to="/" className="logo-link">
                <CodeXml className="logo-icon" />
                <span className="logo-text">ZippyCode</span>
              </Link>
            </div>

            <div className="nav-links">
              <Link to="/questions" className="nav-link">
                Questions
              </Link>
              <Link to="/weekly-top-10" className="nav-link">
                Top Week
              </Link>
              <SignedIn>
                <span className="user-greeting">Hello, {user?.unsafeMetadata?.role || "User"}!</span>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <Link to="/login" className="nav-link sign-in">
                  Sign in
                </Link>
              </SignedOut>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/select-role" element={<SelectRolePage />} />
            <Route path="/" element={<Homepage />} />
            <Route
              path="/questions"
              element={
                <ProtectedRoute>
                  <Questions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/:id"
              element={
                <ProtectedRoute>
                  <QuestionDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/:id/create-question"
              element={
                <ProtectedRoute isProfessor={true}>
                  <CreateQuestion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/:id/edit"
              element={
                <ProtectedRoute isProfessor={true}>
                  <EditQuestion />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
            <Route
              path="/weekly-top-10"
              element={
                <ProtectedRoute>
                  <WeeklyTopLeaderboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
