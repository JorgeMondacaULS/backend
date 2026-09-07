const express = require('express');

const router = express.Router();

const catalogosController = require(
    '../controllers/catalogos.controller'
);

router.get(
    '/generos',
    catalogosController.generos
);

router.get(
    '/regiones',
    catalogosController.regiones
);


router.get(
    '/regiones/:idRegion/provincias',
    catalogosController.provinciasPorRegion
);

router.get(
    '/provincias/:idProvincia/comunas',
    catalogosController.comunasPorProvincia
);

router.get(
    '/motivos',
    catalogosController.motivos
);

module.exports = router;