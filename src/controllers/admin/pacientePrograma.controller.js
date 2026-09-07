const db = require('../../config/database');
const pacienteProgramaModel = require(
    '../../models/pacientePrograma.model'
);

const listarPorPaciente = async (req, res) => {
    try {
        const id_paciente = Number(req.params.idPaciente);

        if (!Number.isInteger(id_paciente) || id_paciente <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Paciente inválido'
            });
        }

        const datos = await pacienteProgramaModel.listarPorPaciente(
            id_paciente
        );

        return res.json({
            success: 1,
            datos
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener los programas del paciente'
        });
    }
};

const actualizar = async (req, res) => {
    try {
        const id_paciente = Number(req.params.idPaciente);

        if (!Number.isInteger(id_paciente) || id_paciente <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Paciente inválido'
            });
        }

        const programas = Array.isArray(req.body.programas)
            ? [
                ...new Set(
                    req.body.programas
                        .map(Number)
                        .filter(
                            id => Number.isInteger(id) && id > 0
                        )
                )
            ]
            : [];

        /*
         * Verificamos que los programas enviados realmente existan
         * y estén activos.
         */
        if (programas.length > 0) {
            const placeholders = programas
                .map(() => '?')
                .join(',');

            const [validos] = await db.query(`
                SELECT id_programa
                FROM programa
                WHERE id_programa IN (${placeholders})
                  AND activo_programa = 1
            `, programas);

            if (validos.length !== programas.length) {
                return res.status(400).json({
                    success: 0,
                    message: 'Uno o más programas no son válidos'
                });
            }
        }

        await pacienteProgramaModel.reemplazar(
            id_paciente,
            programas
        );

        return res.json({
            success: 1,
            message: 'Programas del paciente actualizados'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron actualizar los programas del paciente'
        });
    }
};

module.exports = {
    listarPorPaciente,
    actualizar
};