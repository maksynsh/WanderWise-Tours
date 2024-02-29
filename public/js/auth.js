import axios from 'axios'

import { showAlert } from './alerts'

export const login = async ({ email, password }) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:8080/api/v1/users/login`,
      data: {
        email,
        password,
      },
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully')
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
      url: `http://127.0.0.1:8080/api/v1/users/signup`,
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
