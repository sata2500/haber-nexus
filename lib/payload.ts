import { getPayload as getPayloadClient } from 'payload'
import config from '@payload-config'

let cached = (global as Record<string, any>).payload

if (!cached) {
  cached = (global as Record<string, any>).payload = { client: null, promise: null }
}

export async function getPayload() {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = getPayloadClient({ config })
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}
