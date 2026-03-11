import app from './app'

const PORT = Number(process.env.PORT) || 7225
const HOST = process.env.HOST || '0.0.0.0'

app.listen(
  {
    port: PORT,
    hostname: HOST,
  },
  () => {
    console.log(`🚀 service running at http://${HOST}:${PORT}`)
  }
)
    