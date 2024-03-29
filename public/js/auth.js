import axios from 'axios'

import { showAlert } from './alerts'

export const login = async ({ email, password }) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!')
      window.setTimeout(() => {
        window.location.assign('/')
      }, 500)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export const signup = async ({ name, email, password, passwordConfirm }) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!')
      window.setTimeout(() => {
        window.location.assign('/')
      }, 500)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully!')
      window.setTimeout(() => {
        window.location.reload(true)
      }, 500)
    }
  } catch (err) {
    showAlert('error', 'Could not log out, please try again!')
  }
}
