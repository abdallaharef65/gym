import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'
import store2 from './store2'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Provider store={store2}>
      <App />
    </Provider>
  </Provider>,
)
