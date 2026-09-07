const db = require('../config/database');

const listar = async () => {
    const [rows] = await db.query(`
        SELECT
            p.id_patologia,
            p.nombre_patologia,
            p.activo_patologia,
            p.id_categoria,
            c.nombre_categoria
        FROM patologia p
        INNER JOIN categoria c
            ON c.id_categoria = p.id_categoria
        ORDER BY p.id_patologia ASC
    `);

    return rows;
};

const obtener = async (id_patologia) => {
    const [rows] = await db.query(`
        SELECT
            p.id_patologia,
            p.nombre_patologia,
            p.activo_patologia,
            p.id_categoria,
            c.nombre_categoria
        FROM patologia p
        INNER JOIN categoria c
            ON c.id_categoria = p.id_categoria
        WHERE p.id_patologia = ?
        LIMIT 1
    `, [id_patologia]);

    return rows[0] || null;
};

const insertar = async (nombre_patologia, id_categoria) => {
    const [result] = await db.query(`
        INSERT INTO patologia (
            nombre_patologia,
            activo_patologia,
            id_categoria
        )
        VALUES (?, 1, ?)
    `, [
        nombre_patologia,
        id_categoria
    ]);

    return result.insertId;
};

const actualizar = async (
    id_patologia,
    nombre_patologia,
    id_categoria,
    activo_patologia
) => {
    const [result] = await db.query(`
        UPDATE patologia
        SET
            nombre_patologia = ?,
            id_categoria = ?,
            activo_patologia = ?
        WHERE id_patologia = ?
    `, [
        nombre_patologia,
        id_categoria,
        activo_patologia,
        id_patologia
    ]);

    return result.affectedRows > 0;
};

const listarPorCategoria = async (id_categoria) => {
    const [rows] = await db.query(`
        SELECT
            id_patologia,
            nombre_patologia,
            activo_patologia,
            id_categoria
        FROM patologia
        WHERE id_categoria = ?
          AND activo_patologia = 1
        ORDER BY nombre_patologia ASC
    `, [id_categoria]);

    return rows;
};

module.exports = {
    listar,
    obtener,
    insertar,
    actualizar,
    listarPorCategoria
};