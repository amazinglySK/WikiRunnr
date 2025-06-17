import type { Handle } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import { compare } from 'bcrypt'
import { ACCESS_CODE } from '$env/static/private'

export const handle: Handle = async ({ event, resolve }) => {
  const protected_check = event.route?.id?.startsWith('/(protected)')
  if (protected_check) {
    if (event.cookies.get('access') != 'true') throw redirect(303, '/')
    const sesh = event.cookies.get('session_token') || ''
    const result = await compare(ACCESS_CODE, sesh)
    if (!result) throw redirect(303, '/')
  }
  const response = await resolve(event)
  return response
}
