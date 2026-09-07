const antropometriaModel = require(
    '../../../models/atencion/antropometria.model'
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

        const datos = await antropometriaModel.obtenerPorCita(
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
            message: 'No se pudo obtener la antropometría'
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

        const peso =
            req.body.peso_cita_antropometria ?? '';

        const talla =
            req.body.talla_cita_antropometria ?? '';

        const id = await antropometriaModel.guardar(
            id_cita,
            {
                peso_cita_antropometria: peso,
                talla_cita_antropometria: talla
            }
        );

        const datos = await antropometriaModel.obtenerPorCita(
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
            message: 'No se pudo guardar la antropometría'
        });
    }
};

module.exports = {
    obtener,
    guardar
};