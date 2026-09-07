const actuacionModel = require(
    '../../../models/atencion/actuacion.model'
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

        const datos = await actuacionModel.obtenerPorCita(
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
            message: 'No se pudo obtener la actuación'
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

        const detalle_cita_actuacion =
            req.body.detalle_cita_actuacion?.trim() ?? '';

        if (detalle_cita_actuacion.length > 200) {
            return res.status(400).json({
                success: 0,
                message: 'La actuación no puede superar los 200 caracteres'
            });
        }

        const id = await actuacionModel.guardar(
            id_cita,
            {
                detalle_cita_actuacion
            }
        );

        const datos = await actuacionModel.obtenerPorCita(
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
            message: 'No se pudo guardar la actuación'
        });
    }
};

module.exports = {
    obtener,
    guardar
};