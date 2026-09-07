const express = require('express');

const router = express.Router();

const citasController = require(
    '../../controllers/agenda/citas.controller'
);

/*
 * Agenda diaria.
 * Debe ir antes de /:id
 */
router.get('/', citasController.listarAgenda);

/*
 * Citas de un paciente.
 */
router.get(
    '/paciente/:idPaciente',
    citasController.listarPorPaciente
);

/*
 * Cabecera utilizada al abrir la atención.
 */
router.get(
    '/:id/atencion',
    citasController.cabeceraAtencion
);

/*
 * Una cita específica.
 */
router.get('/:id', citasController.obtener);

/*
 * Crear cita.
 */
router.post('/', citasController.insertar);

/*
 * Cambiar estado.
 */
router.patch(
    '/:id/estado',
    citasController.cambiarEstado
);

/*
 * Reagendar.
 */
router.patch(
    '/:id/reagendar',
    citasController.reagendar
);

module.exports = router;