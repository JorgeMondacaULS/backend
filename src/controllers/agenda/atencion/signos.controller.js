const signosModel = require(
    '../../../models/atencion/signos.model'
);

const obtener = async (req, res) => {
    try {
        const id_cita = Number(req.params.idCita);

        if (!Number.isInteger(id_cita) || id_cita <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Cita inválida'
            });
        }

        const datos = await signosModel.obtenerPorCita(id_cita);

        return res.json({
            success: 1,
            datos: datos || {}
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener los signos vitales'
        });
    }
};

const guardar = async (req, res) => {
    try {
        const id_cita = Number(req.params.idCita);

        if (!Number.isInteger(id_cita) || id_cita <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Cita inválida'
            });
        }

        const datos = {
            frecuencia_cardiaca_cita_signos:
                req.body.frecuencia_cardiaca_cita_signos ?? '',

            frecuencia_respiratoria_cita_signos:
                req.body.frecuencia_respiratoria_cita_signos ?? '',

            temperatura_cita_signos:
                req.body.temperatura_cita_signos ?? '',

            saturacion_cita_signos:
                req.body.saturacion_cita_signos ?? '',

            presion_sistolica_cita_signos:
                req.body.presion_sistolica_cita_signos ?? '',

            presion_diastolica_cita_signos:
                req.body.presion_diastolica_cita_signos ?? ''
        };

        const id = await signosModel.guardar(
            id_cita,
            datos
        );

        return res.json({
            success: 1,
            id
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron guardar los signos vitales'
        });
    }
};

module.exports = {
    obtener,
    guardar
};