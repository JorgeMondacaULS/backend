const db = require('../config/database');

const generos = async () => {
    const [rows] = await db.query(`
        SELECT
            id_genero,
            nombre_genero
        FROM genero
        WHERE activo_genero = 1
        ORDER BY nombre_genero ASC
    `);

    return rows;
};

const regiones = async () => {
    const [rows] = await db.query(`
        SELECT
            id_region,
            nombre_region
        FROM region
        ORDER BY nombre_region ASC
    `);

    return rows;
};

const provinciasPorRegion = async (id_region) => {
    const [rows] = await db.query(`
        SELECT
            id_provincia,
            nombre_provincia,
            id_region
        FROM provincia
        WHERE id_region = ?
        ORDER BY nombre_provincia ASC
    `, [id_region]);

    return rows;
};

const comunasPorProvincia = async (id_provincia) => {
    const [rows] = await db.query(`
        SELECT
            id_comuna,
            nombre_comuna,
            id_provincia
        FROM comuna
        WHERE id_provincia = ?
        ORDER BY nombre_comuna ASC
    `, [id_provincia]);

    return rows;
};

const motivos = async () => {
    const [rows] = await db.query(`
        SELECT
            id_motivo,
            nombre_motivo
        FROM motivo
        ORDER BY nombre_motivo ASC
    `);

    return rows;
};

module.exports = {
    generos,
    regiones,
    provinciasPorRegion,
    comunasPorProvincia,
    motivos
};