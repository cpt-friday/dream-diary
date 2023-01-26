import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import './index.css'

import Root, {loader as rootLoader, action as rootAction} from "./routes/root";
import ErrorPage from './error-page';
import Dream, {loader as dreamLoader, } from './routes/dream';
import EditDream, {action as editAction} from './routes/edit';
import {action as destroyAction} from './routes/destroy';
import Index from './routes';


const router = createBrowserRouter([
  {
    path: '/dream-diary/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {index: true, element: <Index />},
          {
            path: "dreams/:dreamId",
            element: <Dream />,
            loader: dreamLoader,
          },
          {
            path: "dreams/:dreamId/edit",
            element: <EditDream />,
            loader: dreamLoader,
            action: editAction,
          },
          {
            path: "dreams/:dreamId/destroy",
            action: destroyAction,
            errorElement: <div>Oops! There was an error.</div>
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
