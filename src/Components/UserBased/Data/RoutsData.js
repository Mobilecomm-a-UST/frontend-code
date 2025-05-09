import React from 'react'
import HomePage from '../../UserInterface/HomePage'
import LoginPage from '../../UserInterface/LoginPage'
import Profile from '../../UserInterface/Profile/Profile'
import Tools from '../../UserInterface/Tools'
import ViewSite from '../../UserInterface/DPR/ViewSite'
import Dpr from '../../UserInterface/DPR/Dpr'

const RoutsData = () => [
    {
        path: '/',
        element: <HomePage />,
        roles: ['guest', 'user', 'admin']
      },
      {
        path: '/login',
        element: <LoginPage />,
        roles: ['admin']
      },
      {
        path: '/profile/*',
        element: <Profile />,
        roles: ['guest', 'user', 'admin']
      },
      {
        path: '/tools/*',
        element: <Tools />,
        roles: ['guest', 'user', 'admin']
      },
      {
        path: '/view_site/*',
        element: <ViewSite />,
        roles: ['guest', 'user', 'admin']
      },
      {
        path: '/dpr/*',
        element: <Dpr />,
        roles: ['guest', 'user', 'admin']
      }
]

export default RoutsData