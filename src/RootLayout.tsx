import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import App from "./App.tsx";
import About from "./pages/About.tsx";

export default function RootLayout() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route index path="/" element={<App />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  );
}
