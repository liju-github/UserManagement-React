// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import UserLogin from './pages/UserLogin/UserLogin';
import Signup from './pages/UserSignup/UserSignup';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import NotFound from './pages/404/404';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserHome from './pages/UserHome/UserHome';
import ProtectedRoute from './components/ProtectedRoutes';
import PublicRoute from './components/PublicRoutes';
import store from './store/store';

const routeConfig = [
  { path: '/signup', element: <Signup />, isPublic: true },
  { path: '/login', element: <UserLogin />, isPublic: true },
  { path: '/admin/login', element: <AdminLogin />, isPublic: true },
  { path: '/admin/dashboard', element: <AdminDashboard />, requiredRole: 'admin' },
  { path: '/user/home', element: <UserHome />, requiredRole: 'user' },
];

const AppRoutes = () => (
  <Routes>
    {routeConfig.map(({ path, element, isPublic, requiredRole }) => (
      <Route
        key={path}
        path={path}
        element={
          isPublic ? (
            <PublicRoute>{element}</PublicRoute>
          ) : (
            <ProtectedRoute requiredRole={requiredRole}>{element}</ProtectedRoute>
          )
        }
      />
    ))}
    <Route path="/" element={<Navigate to="/user/home" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);


function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
