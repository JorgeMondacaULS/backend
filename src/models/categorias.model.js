const db = require('../config/database');

const listar = async () => {
    const [rows] = await db.query(`
        SELECT
            id_categoria,
            nombre_categoria,
            activo_categoria
        FROM categoria
        ORDER BY id_categoria ASC
    `);

    return rows;
};

const obtener = async (id_categoria) => {
    const [rows] = await db.query(`
        SELECT
            id_categoria,
            nombre_categoria,
            activo_categoria
        FROM categoria
        WHERE id_categoria = ?
        LIMIT 1
    `, [id_categoria]);

    return rows[0] || null;
};

const insertar = async (nombre_categoria) => {
    const [result] = await db.query(`
        INSERT INTO categoria (
            nombre_categoria,
            activo_categoria
        )
        VALUES (?, 1)
    `, [nombre_categoria]);

    return result.insertId;
};

const actualizar = async (
    id_categoria,
    nombre_categoria,
    activo_categoria
) => {
    const [result] = await db.query(`
        UPDATE categoria
        SET
            nombre_categoria = ?,
            activo_categoria = ?
        WHERE id_categoria = ?
    `, [
        nombre_categoria,
        activo_categoria,
        id_categoria
    ]);

    return result.affectedRows > 0;
};

module.exports = {
    listar,
    obtener,
    insertar,
    actualizar
};