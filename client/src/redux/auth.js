export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user,
})

const INITIAL_STATE = {
  user: null,
}

const auth = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

export default auth
