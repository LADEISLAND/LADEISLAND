import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Root from './App'
import AppPage from './pages/App'
import Login from './pages/Login'
import Register from './pages/Register'

const router = createBrowserRouter([
  { path: '/', element: <AppPage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)