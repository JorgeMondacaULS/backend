const motivoModel = require(
    '../../../models/atencion/motivo.model'
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

        const datos = await motivoModel.obtenerPorCita(
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
            message: 'No se pudo obtener el motivo de atención'
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

        const detalle_cita_motivo =
            req.body.detalle_cita_motivo?.trim() ?? '';

        if (detalle_cita_motivo.length > 255) {
            return res.status(400).json({
                success: 0,
                message: 'El motivo no puede superar los 255 caracteres'
            });
        }

        const id = await motivoModel.guardar(
            id_cita,
            {
                detalle_cita_motivo
            }
        );

        const datos = await motivoModel.obtenerPorCita(
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
            message: 'No se pudo guardar el motivo de atención'
        });
    }
};

module.exports = {
    obtener,
    guardar
};