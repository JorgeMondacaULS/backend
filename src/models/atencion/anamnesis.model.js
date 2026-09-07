const CitaBaseModel = require('./citaBase.model');

class AnamnesisModel extends CitaBaseModel {
    constructor() {
        super(
            'cita_anamnesis',
            'id_cita_anamnesis',
            [
                'detalle_cita_anamnesis'
            ]
        );
    }
}

module.exports = new AnamnesisModel();