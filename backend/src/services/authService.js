const axios = require('axios')

let cachedToken = null
let tokenExpiry = null

async function getAccessToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken
  }

  try {
    const authUrl = process.env.AUTH_API_URL || 'https://api.example.com/auth'
    const clientId = process.env.CLIENT_ID
    const clientSecret = process.env.CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('Missing CLIENT_ID or CLIENT_SECRET in .env')
    }

    const response = await axios.post(authUrl, {
      clientId,
      clientSecret
    }, { timeout: 10000 })

    const { access_token, expires_in } = response.data

    if (!access_token) {
      throw new Error('No access_token in auth response')
    }

    cachedToken = access_token
    tokenExpiry = Date.now() + ((expires_in || 3600) * 1000) - 60000

    console.log(`Token cached, expires in ${expires_in || 3600}s`)
    return access_token
  } catch (err) {
    console.error('Failed to get token:', err.message)
    throw err
  }
}

function clearToken() {
  cachedToken = null
  tokenExpiry = null
  console.log('Token cleared')
}

module.exports = { getAccessToken, clearToken }
