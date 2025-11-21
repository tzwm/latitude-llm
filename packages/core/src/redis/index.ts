import Redis, { RedisOptions } from 'ioredis'

export const REDIS_KEY_PREFIX = 'latitude:'

export function buildRedisConnection({ port, host, ...opts }: RedisOptions) {
  console.log('DEBUG: buildRedisConnection called with:', {
    host,
    port,
    opts: { ...opts, password: '***' },
  })
  if (!port) throw new Error('Redis port is required')
  if (!host) throw new Error('Redis host is required')

  return new Promise<Redis>((resolve, reject) => {
    console.log('DEBUG: Creating Redis instance for:', `${host}:${port}`)
    const instance = new Redis({ port, host, ...opts })

    // Set connection timeout to 5 seconds
    const timeout = setTimeout(() => {
      const timeoutError = new Error(
        `Redis connection timed out while connecting to ${host}:${port}`,
      )
      console.error('ERROR:', timeoutError.message)
      reject(timeoutError)
      instance.disconnect()
    }, 5000)

    instance.on('connecting', () => {
      console.log('DEBUG: Redis client connecting to:', `${host}:${port}`)
    })

    instance.on('connect', () => {
      console.log('DEBUG: Redis client connected to:', `${host}:${port}`)
    })

    instance.on('ready', () => {
      console.log('DEBUG: Redis client ready to use for:', `${host}:${port}`)
    })

    instance.connect((err) => {
      clearTimeout(timeout)
      if (err) {
        const connectionError = new Error(
          `Redis connection failed: ${err.message}`,
        )
        console.error('ERROR:', connectionError.message)
        reject(connectionError)
      } else {
        resolve(instance)
      }
    })
  })
}
