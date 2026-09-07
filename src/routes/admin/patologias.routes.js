const express = require('express');

const router = express.Router();

const patologiasController = require('../../controllers/admin/patologias.controller');

router.get('/', patologiasController.listar);

router.get(
    '/categoria/:idCategoria',
    patologiasController.listarPorCategoria
);

router.get('/:id', patologiasController.obtener);

router.post('/', patologiasController.insertar);

router.put('/:id', patologiasController.actualizar);

module.exports = router;