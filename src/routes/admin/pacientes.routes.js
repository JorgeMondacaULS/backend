const express = require('express');

const router = express.Router();

const pacientesController = require(
    '../../controllers/admin/pacientes.controller'
);

router.get('/', pacientesController.listar);
router.get('/:id', pacientesController.obtener);
router.post('/', pacientesController.insertar);
router.put('/:id', pacientesController.actualizar);

module.exports = router;