import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import Scorecard from "./pages/Scorecard";
import LiveScorecard from "./pages/LiveScorecard";
import ViewScorecard from "./pages/ViewScorecard";

import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import FindGame from "./pages/FindGame";
import PostMatch from "./pages/PostMatch";
import MatchDetail from "./pages/MatchDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1e1e2a",
              color: "#f0f0f8",
              border: "1px solid #2a2a3a",
              fontFamily: "Barlow, sans-serif",
              fontWeight: 600,
            },
            success: {
              iconTheme: { primary: "#b6ff00", secondary: "#000" },
            },
            error: {
              iconTheme: { primary: "#ff3d7f", secondary: "#fff" },
            },
          }}
        />
        <Navbar />
        <main style={{ paddingBottom: "70px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/find" element={<FindGame />} />
            <Route path="/post" element={<PostMatch />} />
            <Route path="/match/:id" element={<MatchDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/scorecard" element={<Scorecard />} />
            <Route path="/scorecard/live/:code" element={<LiveScorecard />} />
            <Route path="/scorecard/view/:code" element={<ViewScorecard />} />
          </Routes>
        </main>
        <BottomNav />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;