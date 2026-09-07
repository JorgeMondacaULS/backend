const diagnosticoModel = require(
    '../../../models/atencion/diagnostico.model'
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

        const datos = await diagnosticoModel.obtenerPorCita(
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
            message: 'No se pudo obtener el diagnóstico'
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

        const detalle_cita_diagnostico =
            req.body.detalle_cita_diagnostico?.trim() ?? '';

        if (detalle_cita_diagnostico.length > 200) {
            return res.status(400).json({
                success: 0,
                message: 'El diagnóstico no puede superar los 200 caracteres'
            });
        }

        const id = await diagnosticoModel.guardar(
            id_cita,
            {
                detalle_cita_diagnostico
            }
        );

        const datos = await diagnosticoModel.obtenerPorCita(
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
            message: 'No se pudo guardar el diagnóstico'
        });
    }
};

module.exports = {
    obtener,
    guardar
};