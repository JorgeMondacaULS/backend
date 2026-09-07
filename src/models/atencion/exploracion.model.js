const CitaBaseModel = require('./citaBase.model');

class ExploracionModel extends CitaBaseModel {
    constructor() {
        super(
            'cita_exploracion',
            'id_cita_exploracion',
            [
                'detalle_cita_exploracion'
            ]
        );
    }
}

module.exports = new ExploracionModel();