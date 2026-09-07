const db = require('../config/database');

/**
 * Obtiene todas las patologías activas de una categoría
 * junto con el estado de asociación para un paciente.
 */
const listarPorCategoria = async (id_paciente, id_categoria) => {
    const [rows] = await db.query(`
        SELECT
            p.id_patologia,
            p.nombre_patologia,
            p.id_categoria,
            c.nombre_categoria,

            pp.activo_paciente_patologia,
            pp.fecha_registro_paciente_patologia

        FROM patologia p

        INNER JOIN categoria c
            ON c.id_categoria = p.id_categoria

        LEFT JOIN paciente_patologia pp
            ON pp.id_patologia = p.id_patologia
            AND pp.id_paciente = ?

        WHERE p.id_categoria = ?
          AND p.activo_patologia = 1

        ORDER BY p.nombre_patologia ASC
    `, [
        id_paciente,
        id_categoria
    ]);

    return rows;
};


/**
 * Obtiene las patologías actualmente activas de un paciente.
 */
const listarPorPaciente = async (id_paciente) => {
    const [rows] = await db.query(`
        SELECT
            pp.id_paciente,
            pp.id_patologia,
            pp.fecha_registro_paciente_patologia,
            p.nombre_patologia,
            p.id_categoria,
            c.nombre_categoria

        FROM paciente_patologia pp

        INNER JOIN patologia p
            ON p.id_patologia = pp.id_patologia

        INNER JOIN categoria c
            ON c.id_categoria = p.id_categoria

        WHERE pp.id_paciente = ?
          AND pp.activo_paciente_patologia = 1

        ORDER BY
            c.nombre_categoria ASC,
            p.nombre_patologia ASC
    `, [id_paciente]);

    return rows;
};


/**
 * Busca una relación específica.
 */
const obtenerRelacion = async (id_paciente, id_patologia) => {
    const [rows] = await db.query(`
        SELECT
            id_paciente,
            id_patologia,
            fecha_registro_paciente_patologia,
            activo_paciente_patologia
        FROM paciente_patologia
        WHERE id_paciente = ?
          AND id_patologia = ?
        LIMIT 1
    `, [
        id_paciente,
        id_patologia
    ]);

    return rows[0] || null;
};


/**
 * Crea una relación nueva.
 */
const insertar = async (id_paciente, id_patologia) => {
    await db.query(`
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
};


/**
 * Reactiva una relación existente.
 */
const reactivar = async (id_paciente, id_patologia) => {
    await db.query(`
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
};


/**
 * Desactiva una relación.
 */
const desactivar = async (id_paciente, id_patologia) => {
    await db.query(`
        UPDATE paciente_patologia
        SET activo_paciente_patologia = 0
        WHERE id_paciente = ?
          AND id_patologia = ?
    `, [
        id_paciente,
        id_patologia
    ]);
};

module.exports = {
    listarPorCategoria,
    listarPorPaciente,
    obtenerRelacion,
    insertar,
    reactivar,
    desactivar
};