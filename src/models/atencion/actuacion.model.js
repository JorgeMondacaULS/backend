const CitaBaseModel = require('./citaBase.model');

class ActuacionModel extends CitaBaseModel {
    constructor() {
        super(
            'cita_actuacion',
            'id_cita_actuacion',
            [
                'detalle_cita_actuacion'
            ]
        );
    }
}

module.exports = new ActuacionModel();