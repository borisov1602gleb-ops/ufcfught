import { BrowserRouter, HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { RequireAuth } from "./auth/RequireAuth";
import { LoginPage } from "./pages/LoginPage";
import { HubPage } from "./pages/HubPage";

// На статичном хостинге (GitHub Pages) используем hash-роутинг, чтобы
// прямые ссылки/refresh не упирались в 404. В обычной сборке — BrowserRouter.
const Router = import.meta.env.VITE_HASH_ROUTER === "1" ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/hub"
            element={
              <RequireAuth>
                <HubPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/hub" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
