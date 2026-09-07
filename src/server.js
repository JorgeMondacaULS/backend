require('dotenv').config()

const app = require('./app')

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`)
})

process.on('SIGTERM', () => {
    console.log('SIGTERM recibido. Cerrando servidor...')

    server.close(() => {
        console.log('Servidor cerrado.')
        process.exit(0)
    })
})
