const anamnesisModel = require(
    '../../../models/atencion/anamnesis.model'
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

        const datos = await anamnesisModel.obtenerPorCita(
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
            message: 'No se pudo obtener la anamnesis'
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

        const detalle_cita_anamnesis =
            req.body.detalle_cita_anamnesis?.trim() ?? '';

        if (detalle_cita_anamnesis.length > 200) {
            return res.status(400).json({
                success: 0,
                message: 'La anamnesis no puede superar los 200 caracteres'
            });
        }

        const id = await anamnesisModel.guardar(
            id_cita,
            {
                detalle_cita_anamnesis
            }
        );

        const datos = await anamnesisModel.obtenerPorCita(
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
            message: 'No se pudo guardar la anamnesis'
        });
    }
};

module.exports = {
    obtener,
    guardar
};