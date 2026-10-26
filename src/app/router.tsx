import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { RecipesListPage } from '../features/receitas/RecipesListPage';
import { RecipeDetailPage } from '../features/receitas/RecipeDetailPage';
import { FavoritesPage } from '../features/receitas/FavoritesPage';
import { DespensaPage } from '../features/despensa/DespensaPage';

import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
