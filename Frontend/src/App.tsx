import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages...
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import AuthLayout from "./Layouts/AuthLayout";
import MainLayout from "./Layouts/MainLayout";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                </Route>
                <Route element={<AuthLayout />}>
                    <Route path="/sign-in" element={<Signin />} />
                    <Route path="/sign-up" element={<Signup />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
