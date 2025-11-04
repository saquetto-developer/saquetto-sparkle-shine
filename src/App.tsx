import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const Clientes = lazy(() => import("./pages/Clientes"));
const Fornecedores = lazy(() => import("./pages/Fornecedores"));
const NotasFiscais = lazy(() => import("./pages/NotasFiscais"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const ErrosAlertas = lazy(() => import("./pages/ErrosAlertas"));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="p-6 space-y-4">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-4 w-96" />
    <div className="grid gap-4 mt-6">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="fiscal-audit-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<PageLoader />}>
                        <DashboardPage />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/clientes" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<PageLoader />}>
                        <Clientes />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/notas-fiscais" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<PageLoader />}>
                        <NotasFiscais />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/fornecedores" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<PageLoader />}>
                        <Fornecedores />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/relatorios" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<PageLoader />}>
                        <Relatorios />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/erros-alertas" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<PageLoader />}>
                        <ErrosAlertas />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
