import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LayoutShell from "@/components/LayoutShell";
import HomePage from "@/pages/HomePage";
import ToolsHubPage from "@/pages/ToolsHubPage";
import BooksPage from "@/pages/BooksPage";
import AboutPage from "@/pages/AboutPage";
import EngineRoutePage from "@/pages/EngineRoutePage";

const TestimonialsPage = lazy(() => import("@/pages/TestimonialsPage"));

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsHubPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/testimonials"
          element={
            <Suspense fallback={<p className="v3-muted">Loading…</p>}>
              <TestimonialsPage />
            </Suspense>
          }
        />
        <Route path="/engines/:engineId" element={<EngineRoutePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
