const CitaBaseModel = require('./citaBase.model');

class MotivoModel extends CitaBaseModel {
    constructor() {
        super(
            'cita_motivo',
            'id_cita_motivo',
            [
                'detalle_cita_motivo'
            ]
        );
    }
}

module.exports = new MotivoModel();