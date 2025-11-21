import '@latitude-data/env'
import { envClient as __ } from '$/envClient'

export async function GET() {
  console.log('DEBUG: Health check API called')
  const startTime = Date.now()
  const response = Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
  console.log(
    'DEBUG: Health check API completed in',
    Date.now() - startTime,
    'ms',
  )
  return response
}
