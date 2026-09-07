const atencionService = require(
    '../../../services/atencion.service'
);

const completitud = async (req, res) => {
    try {
        const id_cita = Number(req.params.idCita);

        if (!Number.isInteger(id_cita) || id_cita <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Cita inválida'
            });
        }

        const datos =
            await atencionService.obtenerCompletitud(
                id_cita
            );

        if (!datos) {
            return res.status(404).json({
                success: 0,
                message: 'La cita no existe'
            });
        }

        return res.json({
            success: 1,
            datos
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo obtener la completitud de la atención'
        });
    }
};

const cerrar = async (req, res) => {
    try {
        const id_cita = Number(req.params.idCita);

        if (!Number.isInteger(id_cita) || id_cita <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Cita inválida'
            });
        }

        const resultado =
            await atencionService.cerrarAtencion(
                id_cita
            );

        if (!resultado.success) {
            return res
                .status(resultado.status || 400)
                .json({
                    success: 0,
                    message: resultado.message,
                    completitud:
                        resultado.completitud || undefined
                });
        }

        return res.json({
            success: 1,
            message: resultado.message,
            ya_realizada:
                resultado.ya_realizada
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo cerrar la atención'
        });
    }
};

module.exports = {
    completitud,
    cerrar
};