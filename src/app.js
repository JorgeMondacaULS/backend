const express = require('express')
const cors = require('cors')

const categoriasRoutes = require('./routes/admin/categorias.routes')
const patologiasRoutes = require('./routes/admin/patologias.routes')
const pacientesRoutes = require('./routes/admin/pacientes.routes')
const catalogosRoutes = require('./routes/catalogos.routes')
const pacientePatologiaRoutes = require('./routes/admin/pacientePatologia.routes')
const programasRoutes = require('./routes/admin/programas.routes')
const pacienteProgramaRoutes = require('./routes/admin/pacientePrograma.routes')

const citasRoutes = require('./routes/agenda/citas.routes')
const atencionRoutes = require('./routes/agenda/atencion.routes')

const app = express()

const frontendUrl =
  process.env.FRONTEND_URL ||
  'http://localhost:5173'

app.use(
  cors({
    origin: frontendUrl,
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  }),
)

app.use(express.json())

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.get('/api', (req, res) => {
  res.json({
    success: 1,
    message: 'API funcionando',
  })
})

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: 1,
    message: 'Backend operativo',
  })
})

app.use(
  '/api/admin/categorias',
  categoriasRoutes,
)

app.use(
  '/api/admin/patologias',
  patologiasRoutes,
)

app.use(
  '/api/admin/pacientes',
  pacientesRoutes,
)

app.use(
  '/api/catalogos',
  catalogosRoutes,
)

app.use(
  '/api/admin/paciente-patologias',
  pacientePatologiaRoutes,
)

app.use(
  '/api/admin/programas',
  programasRoutes,
)

app.use(
  '/api/admin/paciente-programas',
  pacienteProgramaRoutes,
)

app.use(
  '/api/agenda/citas',
  citasRoutes,
)

app.use(
  '/api/agenda/atencion',
  atencionRoutes,
)

app.use((req, res) => {
  res.status(404).json({
    success: 0,
    message: 'Ruta no encontrada',
  })
})

module.exports = app
