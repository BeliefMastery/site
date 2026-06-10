import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LayoutShell from "@/components/LayoutShell";
import HomePage from "@/pages/HomePage";
import ToolsHubPage from "@/pages/ToolsHubPage";
import EngineRoutePage from "@/pages/EngineRoutePage";

const BooksPage = lazy(() => import("@/pages/BooksPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const TestimonialsPage = lazy(() => import("@/pages/TestimonialsPage"));

function PageLoading() {
  return <p className="v3-muted">Loading…</p>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsHubPage />} />
        <Route
          path="/books"
          element={
            <Suspense fallback={<PageLoading />}>
              <BooksPage />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<PageLoading />}>
              <AboutPage />
            </Suspense>
          }
        />
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
