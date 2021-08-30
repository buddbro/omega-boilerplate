import { createStore, combineReducers } from 'redux'
import auth from './auth'

export const store = createStore(
  combineReducers({
    auth,
  })
)
