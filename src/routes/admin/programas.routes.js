const express = require('express');

const router = express.Router();

const programasController = require(
    '../../controllers/admin/programas.controller'
);

router.get('/', programasController.listar);
router.get('/activos', programasController.listarActivos);
router.get('/:id', programasController.obtener);

router.post('/', programasController.insertar);
router.put('/:id', programasController.actualizar);

module.exports = router;