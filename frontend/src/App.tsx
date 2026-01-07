import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom"; 
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/auth'
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Workouts from './pages/Workouts';

function Layout() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  )
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "workouts",
          element: <Workouts />
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App