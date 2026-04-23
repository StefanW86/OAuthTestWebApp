<script setup>
import { ref, onMounted } from 'vue'
import { login, logout, getUser, handleCallback } from './auth.js'

const user = ref(null)
const error = ref(null)
const loading = ref(true)

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

onMounted(async () => {
  try {
    await handleCallback()
    user.value = await getUser()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const username = () =>
  user.value?.profile?.name ||
  user.value?.profile?.preferred_username ||
  user.value?.profile?.email ||
  'Unbekannt'
</script>

<template>
  <div style="font-family: monospace; max-width: 900px; margin: 40px auto; padding: 0 20px;">
    <h1>OAuth / OIDC Tester</h1>
    <p>Testtool für OpenID Connect gegen Microsoft Entra ID.</p>

    <div v-if="loading">
      <p>Lade...</p>
    </div>

    <div v-else-if="error" style="color: red;">
      <strong>Fehler:</strong> {{ error }}
    </div>

    <div v-else>
      <button @click="user ? logout() : login()" style="font-size: 1rem; padding: 8px 16px; cursor: pointer;">
        {{ user ? 'Logout' : 'Login' }}
      </button>

      <div v-if="user" style="margin-top: 24px;">
        <h2>Angemeldet als</h2>
        <p><strong>{{ username() }}</strong></p>

        <h2>Access Token</h2>
        <pre style="background: #f0f0f0; padding: 12px; overflow-x: auto; word-break: break-all; white-space: pre-wrap; border: 1px solid #ccc;">{{ user.access_token }}</pre>

        <details style="margin-top: 16px;">
          <summary style="cursor: pointer; font-weight: bold;">Access Token Claims (decoded)</summary>
          <pre style="background: #f0f0f0; padding: 12px; overflow-x: auto; border: 1px solid #ccc; margin-top: 8px;">{{ JSON.stringify(decodeJwt(user.access_token), null, 2) }}</pre>
        </details>

        <details style="margin-top: 12px;">
          <summary style="cursor: pointer; font-weight: bold;">ID Token Claims (decoded)</summary>
          <pre style="background: #f0f0f0; padding: 12px; overflow-x: auto; border: 1px solid #ccc; margin-top: 8px;">{{ JSON.stringify(user.profile, null, 2) }}</pre>
        </details>

        <details style="margin-top: 12px;">
          <summary style="cursor: pointer; font-weight: bold;">Vollständiges OIDC User Objekt</summary>
          <pre style="background: #f0f0f0; padding: 12px; overflow-x: auto; border: 1px solid #ccc; margin-top: 8px;">{{ JSON.stringify(user, null, 2) }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>
