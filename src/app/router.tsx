import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

import { ProtectedRoute } from './ProtectedRoute';

const RecipesListPage = lazy(() =>
  import('../features/receitas/RecipesListPage').then((module) => ({
    default: module.RecipesListPage,
  })),
);
const RecipeDetailPage = lazy(() =>
  import('../features/receitas/RecipeDetailPage').then((module) => ({
    default: module.RecipeDetailPage,
  })),
);
const FavoritesPage = lazy(() =>
  import('../features/receitas/FavoritesPage').then((module) => ({
    default: module.FavoritesPage,
  })),
);
const DespensaPage = lazy(() =>
  import('../features/despensa/DespensaPage').then((module) => ({
    default: module.DespensaPage,
  })),
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div role="status" className="min-h-screen bg-cream p-8 text-ink">
            Carregando página...
          </div>
        }
      >
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />

          {/* Rotas protegidas */}
          <Route
            path="/despensa"
            element={
              <ProtectedRoute>
                <DespensaPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/receitas-sugeridas"
            element={
              <ProtectedRoute>
                <RecipesListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favoritos"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/receitas/:id"
            element={
              <ProtectedRoute>
                <RecipeDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Redirecionamentos */}
          <Route path="/" element={<Navigate to="/despensa" replace />} />

          <Route path="*" element={<Navigate to="/despensa" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
