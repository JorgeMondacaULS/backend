const db = require('../config/database');

const listar = async () => {
    const [rows] = await db.query(`
        SELECT
            id_programa,
            nombre_programa,
            activo_programa
        FROM programa
        ORDER BY nombre_programa ASC
    `);

    return rows;
};

const listarActivos = async () => {
    const [rows] = await db.query(`
        SELECT
            id_programa,
            nombre_programa
        FROM programa
        WHERE activo_programa = 1
        ORDER BY nombre_programa ASC
    `);

    return rows;
};

const obtener = async (id_programa) => {
    const [rows] = await db.query(`
        SELECT
            id_programa,
            nombre_programa,
            activo_programa
        FROM programa
        WHERE id_programa = ?
        LIMIT 1
    `, [id_programa]);

    return rows[0] || null;
};

const insertar = async (nombre_programa) => {
    const [result] = await db.query(`
        INSERT INTO programa (
            nombre_programa,
            activo_programa
        )
        VALUES (?, 1)
    `, [nombre_programa]);

    return result.insertId;
};

const actualizar = async (
    id_programa,
    nombre_programa,
    activo_programa
) => {
    const [result] = await db.query(`
        UPDATE programa
        SET
            nombre_programa = ?,
            activo_programa = ?
        WHERE id_programa = ?
    `, [
        nombre_programa,
        activo_programa,
        id_programa
    ]);

    return result.affectedRows > 0;
};

module.exports = {
    listar,
    listarActivos,
    obtener,
    insertar,
    actualizar
};