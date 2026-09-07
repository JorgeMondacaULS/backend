const CitaBaseModel = require('./citaBase.model');

class DiagnosticoModel extends CitaBaseModel {
    constructor() {
        super(
            'cita_diagnostico',
            'id_cita_diagnostico',
            [
                'detalle_cita_diagnostico'
            ]
        );
    }
}

module.exports = new DiagnosticoModel();