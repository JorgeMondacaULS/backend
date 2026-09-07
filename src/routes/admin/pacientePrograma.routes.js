const express = require('express');

const router = express.Router();

const pacienteProgramaController = require(
    '../../controllers/admin/pacientePrograma.controller'
);

router.get(
    '/:idPaciente',
    pacienteProgramaController.listarPorPaciente
);

router.put(
    '/:idPaciente',
    pacienteProgramaController.actualizar
);

module.exports = router;