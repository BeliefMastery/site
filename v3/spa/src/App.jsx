import { Navigate, Route, Routes } from "react-router-dom";
import LayoutShell from "@/components/LayoutShell";
import HomePage from "@/pages/HomePage";
import ToolsHubPage from "@/pages/ToolsHubPage";
import BooksPage from "@/pages/BooksPage";
import AboutPage from "@/pages/AboutPage";
import EngineRoutePage from "@/pages/EngineRoutePage";

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsHubPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/engines/:engineId" element={<EngineRoutePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
