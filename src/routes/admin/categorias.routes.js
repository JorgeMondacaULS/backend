const express = require('express');

const router = express.Router();

const categoriasController = require('../../controllers/admin/categorias.controller');

router.get('/', categoriasController.listar);
router.get('/:id', categoriasController.obtener);
router.post('/', categoriasController.insertar);
router.put('/:id', categoriasController.actualizar);

module.exports = router;