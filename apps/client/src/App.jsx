import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import usePortfolio from "./hooks/usePortfolio";
import PortfolioPage from "./pages/PortfolioPage";

const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));

function RouteFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#080b13] text-cyan-200">
      <LoaderCircle
        size={24}
        className="animate-spin"
        aria-label="Loading page"
      />
    </main>
  );
}

function PublicPortfolio() {
  const { portfolio, loading, apiError } = usePortfolio();
  return (
    <PortfolioPage data={portfolio} loading={loading} apiError={apiError} />
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<PublicPortfolio />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
          <Route path="*" element={<PublicPortfolio />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
