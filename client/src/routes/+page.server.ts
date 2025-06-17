import type { Actions } from './$types'
import { ACCESS_CODE } from '$env/static/private'
import { redirect, type Load } from '@sveltejs/kit'
import { hash } from 'bcrypt'

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData()
    const access_code = data.get('access_code')
    if (import.meta.env.DEV || access_code === ACCESS_CODE) {
      cookies.set('access', 'true', { path: '/', sameSite: 'strict' })
      const session_token = await hash(ACCESS_CODE, 10)
      cookies.set('session_token', session_token, {
        path: '/',
        sameSite: 'strict',
      })
      redirect(303, '/app')
    }
  },
} satisfies Actions
