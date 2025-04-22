import { Link, BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Questions from "./Questions"
import Homepage from "./Homepage"
import LoginForm from "./LoginForm"
import CreateQuestion from "./CreateQuestion"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react"
import ProtectedRoute from "./Protected-Route"
import SelectRolePage from "./Select-Role"
import EditQuestion from "./EditQuestion"
import { Chat } from "./Chat"
import QuestionDetails from "./RunCode"
import WeeklyTopLeaderboard from "./LeaderBoard"
import { Zap } from "lucide-react"

function App() {
  const { user } = useUser()
  return (
    <Router>
      <div className="App">
        {/* LeetCode-inspired Navigation Bar */}
        <header className="app-header">
          <div className="app-container">
            <div className="logo">
              <Link to="/" className="logo-link">
                <Zap className="logo-icon" />
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
        <style jsx>{`
          /* App Styles */
          .App {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            color: #ffffff;
            background-color: #1a1a1a;
            min-height: 100vh;
          }

          /* Header Styles */
          .app-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 40px;
            background-color: #262626;
            position: sticky;
            top: 0;
            z-index: 100;
          }

          .app-container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .logo {
            display: flex;
            align-items: center;
          }

          .logo-link {
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
          }

          .logo-icon {
            color: #ffa116;
            width: 24px;
            height: 24px;
          }

          .logo-text {
            font-size: 20px;
            font-weight: 700;
            color: white;
          }

          .nav-links {
            display: flex;
            gap: 24px;
            align-items: center;
          }

          .nav-link {
            color: #b3b3b3;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.2s;
          }

          .nav-link:hover {
            color: white;
          }

          .sign-in {
            color: #ffa116;
            font-weight: 500;
          }

          .user-greeting {
            color: #b3b3b3;
            font-size: 14px;
            margin-right: 16px;
          }

          /* Main Content */
          .main-content {
            min-height: calc(100vh - 64px); /* Adjust based on header height */
          }
        `}</style>
      </div>
    </Router>
  )
}

export default App
