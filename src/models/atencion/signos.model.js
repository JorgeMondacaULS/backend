const CitaBaseModel = require('./citaBase.model');

class SignosModel extends CitaBaseModel {
    constructor() {
        super(
            'cita_signos',
            'id_cita_signos',
            [
                'frecuencia_cardiaca_cita_signos',
                'frecuencia_respiratoria_cita_signos',
                'temperatura_cita_signos',
                'saturacion_cita_signos',
                'presion_sistolica_cita_signos',
                'presion_diastolica_cita_signos'
            ]
        );
    }
}

module.exports = new SignosModel();