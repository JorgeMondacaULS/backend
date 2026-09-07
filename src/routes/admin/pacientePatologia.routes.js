const express = require('express');

const router = express.Router();

const pacientePatologiaController = require(
    '../../controllers/admin/pacientePatologia.controller'
);

router.get(
    '/:idPaciente',
    pacientePatologiaController.listarPorPaciente
);

router.get(
    '/:idPaciente/categoria/:idCategoria',
    pacientePatologiaController.listarPorCategoria
);

router.put(
    '/:idPaciente',
    pacientePatologiaController.actualizar
);

module.exports = router;