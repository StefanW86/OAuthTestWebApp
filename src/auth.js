import { UserManager } from 'oidc-client-ts'

const settings = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid profile email',
  post_logout_redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
}

const userManager = new UserManager(settings)

export function login() {
  return userManager.signinRedirect()
}

export function logout() {
  return userManager.signoutRedirect()
}

export function getUser() {
  return userManager.getUser()
}

export async function handleCallback() {
  if (window.location.search.includes('code=')) {
    const user = await userManager.signinRedirectCallback()
    window.history.replaceState({}, document.title, '/')
    return user
  }
  return null
}
