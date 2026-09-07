const express = require('express');
const router = express.Router();

const signosController = require(
    '../../controllers/agenda/atencion/signos.controller'
);

const antropometriaController = require(
    '../../controllers/agenda/atencion/antropometria.controller'
);

const motivoController = require(
    '../../controllers/agenda/atencion/motivo.controller'
);

const anamnesisController = require(
    '../../controllers/agenda/atencion/anamnesis.controller'
);

const exploracionController = require(
    '../../controllers/agenda/atencion/exploracion.controller'
);

const diagnosticoController = require(
    '../../controllers/agenda/atencion/diagnostico.controller'
);

const actuacionController = require(
    '../../controllers/agenda/atencion/actuacion.controller'
);

const accionesController = require(
    '../../controllers/agenda/atencion/acciones.controller'
);


// COMPLETITUD
router.get(
    '/:idCita/completitud',
    accionesController.completitud
);


// CIERRE DE ATENCIÓN
router.patch(
    '/:idCita/cerrar',
    accionesController.cerrar
);


// SIGNOS VITALES
router.get(
    '/:idCita/signos',
    signosController.obtener
);

router.put(
    '/:idCita/signos',
    signosController.guardar
);


// ANTROPOMETRÍA
router.get(
    '/:idCita/antropometria',
    antropometriaController.obtener
);

router.put(
    '/:idCita/antropometria',
    antropometriaController.guardar
);


// MOTIVO CLÍNICO
router.get(
    '/:idCita/motivo',
    motivoController.obtener
);

router.put(
    '/:idCita/motivo',
    motivoController.guardar
);


// ANAMNESIS
router.get(
    '/:idCita/anamnesis',
    anamnesisController.obtener
);

router.put(
    '/:idCita/anamnesis',
    anamnesisController.guardar
);


// EXPLORACIÓN
router.get(
    '/:idCita/exploracion',
    exploracionController.obtener
);

router.put(
    '/:idCita/exploracion',
    exploracionController.guardar
);


// DIAGNÓSTICO
router.get(
    '/:idCita/diagnostico',
    diagnosticoController.obtener
);

router.put(
    '/:idCita/diagnostico',
    diagnosticoController.guardar
);


// ACTUACIÓN
router.get(
    '/:idCita/actuacion',
    actuacionController.obtener
);

router.put(
    '/:idCita/actuacion',
    actuacionController.guardar
);


module.exports = router;