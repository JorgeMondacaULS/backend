const exploracionModel = require(
    '../../../models/atencion/exploracion.model'
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

        const datos = await exploracionModel.obtenerPorCita(
            id_cita
        );

        return res.json({
            success: 1,
            datos: datos || {}
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo obtener la exploración'
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

        const detalle_cita_exploracion =
            req.body.detalle_cita_exploracion?.trim() ?? '';

        if (detalle_cita_exploracion.length > 200) {
            return res.status(400).json({
                success: 0,
                message: 'La exploración no puede superar los 200 caracteres'
            });
        }

        const id = await exploracionModel.guardar(
            id_cita,
            {
                detalle_cita_exploracion
            }
        );

        const datos = await exploracionModel.obtenerPorCita(
            id_cita
        );

        return res.json({
            success: 1,
            id,
            datos
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo guardar la exploración'
        });
    }
};

module.exports = {
    obtener,
    guardar
};