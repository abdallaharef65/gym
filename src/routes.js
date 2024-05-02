/* eslint-disable */
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/index'))
const Users = React.lazy(() => import('./views/pages/Users/Users'))
const Calendar = React.lazy(() => import('./views/pages/calendar/calendar'))
const Roles = React.lazy(() => import('./views/pages/role/Roles'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/users', name: 'Users', element: Users, exact: true },
  { path: '/calendar', name: 'Calendar', element: Calendar, exact: true },
  { path: '/role', name: 'Role', element: Roles, exact: true },
]

export default routes
