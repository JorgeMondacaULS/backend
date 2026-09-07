const db = require('../../config/database');
const pacientePatologiaModel = require('../../models/pacientePatologia.model');


const listarPorCategoria = async (req, res) => {
    try {
        const id_paciente = Number(req.params.idPaciente);
        const id_categoria = Number(req.params.idCategoria);

        if (
            !Number.isInteger(id_paciente) ||
            id_paciente <= 0 ||
            !Number.isInteger(id_categoria) ||
            id_categoria <= 0
        ) {
            return res.status(400).json({
                success: 0,
                message: 'Paciente o categoría inválidos'
            });
        }

        const datos = await pacientePatologiaModel.listarPorCategoria(
            id_paciente,
            id_categoria
        );

        return res.json({
            success: 1,
            datos
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener las patologías del paciente'
        });
    }
};


const listarPorPaciente = async (req, res) => {
    try {
        const id_paciente = Number(req.params.idPaciente);

        if (!Number.isInteger(id_paciente) || id_paciente <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Paciente inválido'
            });
        }

        const datos = await pacientePatologiaModel.listarPorPaciente(
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
            message: 'No se pudieron obtener las patologías del paciente'
        });
    }
};


/**
 * Actualiza las patologías seleccionadas para UNA categoría.
 *
 * Body:
 * {
 *     "id_categoria": 2,
 *     "patologias": [3, 5, 8]
 * }
 */
const actualizar = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const id_paciente = Number(req.params.idPaciente);
        const id_categoria = Number(req.body.id_categoria);

        const patologias = Array.isArray(req.body.patologias)
            ? req.body.patologias
                .map(Number)
                .filter(id => Number.isInteger(id) && id > 0)
            : [];

        if (!Number.isInteger(id_paciente) || id_paciente <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Paciente inválido'
            });
        }

        if (!Number.isInteger(id_categoria) || id_categoria <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Categoría inválida'
            });
        }

        await connection.beginTransaction();

        /*
         * Primero obtenemos las patologías válidas de esta categoría.
         */
        const [patologiasCategoria] = await connection.query(`
            SELECT id_patologia
            FROM patologia
            WHERE id_categoria = ?
              AND activo_patologia = 1
        `, [id_categoria]);

        const idsValidos = patologiasCategoria.map(
            item => Number(item.id_patologia)
        );

        /*
         * Evitamos que desde el frontend puedan enviarnos una
         * patología perteneciente a otra categoría.
         */
        const seleccionadas = [
            ...new Set(
                patologias.filter(id => idsValidos.includes(id))
            )
        ];

        /*
         * Relaciones existentes del paciente para esta categoría.
         */
        const [existentes] = await connection.query(`
            SELECT
                pp.id_patologia,
                pp.activo_paciente_patologia
            FROM paciente_patologia pp
            INNER JOIN patologia p
                ON p.id_patologia = pp.id_patologia
            WHERE pp.id_paciente = ?
              AND p.id_categoria = ?
        `, [
            id_paciente,
            id_categoria
        ]);

        const mapaExistentes = new Map(
            existentes.map(item => [
                Number(item.id_patologia),
                Number(item.activo_paciente_patologia)
            ])
        );

        /*
         * Desactivar las que estaban seleccionadas anteriormente
         * pero ya no fueron seleccionadas.
         */
        for (const [id_patologia, activo] of mapaExistentes) {
            if (activo === 1 && !seleccionadas.includes(id_patologia)) {
                await connection.query(`
                    UPDATE paciente_patologia
                    SET activo_paciente_patologia = 0
                    WHERE id_paciente = ?
                      AND id_patologia = ?
                `, [
                    id_paciente,
                    id_patologia
                ]);
            }
        }

        /*
         * Insertar nuevas o reactivar existentes.
         */
        for (const id_patologia of seleccionadas) {

            if (!mapaExistentes.has(id_patologia)) {

                await connection.query(`
                    INSERT INTO paciente_patologia (
                        id_paciente,
                        id_patologia,
                        fecha_registro_paciente_patologia,
                        activo_paciente_patologia
                    )
                    VALUES (?, ?, NOW(), 1)
                `, [
                    id_paciente,
                    id_patologia
                ]);

            } else if (mapaExistentes.get(id_patologia) === 0) {

                await connection.query(`
                    UPDATE paciente_patologia
                    SET
                        activo_paciente_patologia = 1,
                        fecha_registro_paciente_patologia = NOW()
                    WHERE id_paciente = ?
                      AND id_patologia = ?
                `, [
                    id_paciente,
                    id_patologia
                ]);
            }
        }

        await connection.commit();

        return res.json({
            success: 1,
            message: 'Patologías del paciente actualizadas'
        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron actualizar las patologías del paciente'
        });

    } finally {
        connection.release();
    }
};


module.exports = {
    listarPorCategoria,
    listarPorPaciente,
    actualizar
};