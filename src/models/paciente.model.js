const db = require('../config/database');

const listar = async () => {
    const [rows] = await db.query(`
        SELECT
            p.id_paciente,
            p.dni_paciente,
            p.nombre_paciente,
            p.primer_apellido_paciente,
            p.segundo_apellido_paciente,
            p.fecha_nacimiento_paciente,
            p.direccion_paciente,
            p.email_paciente,
            p.telefono_paciente,
            p.activo_paciente,
            p.id_genero,
            g.nombre_genero,
            p.id_comuna,
            c.nombre_comuna,
            pr.id_provincia,
            pr.nombre_provincia,
            r.id_region,
            r.nombre_region
        FROM paciente p
        LEFT JOIN genero g
            ON g.id_genero = p.id_genero
        LEFT JOIN comuna c
            ON c.id_comuna = p.id_comuna
        LEFT JOIN provincia pr
            ON pr.id_provincia = c.id_provincia
        LEFT JOIN region r
            ON r.id_region = pr.id_region
        ORDER BY
            p.primer_apellido_paciente,
            p.segundo_apellido_paciente,
            p.nombre_paciente
    `);

    return rows;
};

const obtener = async (id_paciente) => {
    const [rows] = await db.query(`
        SELECT
            p.*,
            g.nombre_genero,
            c.nombre_comuna,
            pr.id_provincia,
            pr.nombre_provincia,
            r.id_region,
            r.nombre_region
        FROM paciente p
        LEFT JOIN genero g
            ON g.id_genero = p.id_genero
        LEFT JOIN comuna c
            ON c.id_comuna = p.id_comuna
        LEFT JOIN provincia pr
            ON pr.id_provincia = c.id_provincia
        LEFT JOIN region r
            ON r.id_region = pr.id_region
        WHERE p.id_paciente = ?
        LIMIT 1
    `, [id_paciente]);

    return rows[0] || null;
};

const insertar = async (paciente) => {
    const [result] = await db.query(`
        INSERT INTO paciente (
            dni_paciente,
            nombre_paciente,
            primer_apellido_paciente,
            segundo_apellido_paciente,
            fecha_nacimiento_paciente,
            direccion_paciente,
            email_paciente,
            telefono_paciente,
            activo_paciente,
            id_genero,
            id_comuna
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `, [
        paciente.dni_paciente,
        paciente.nombre_paciente,
        paciente.primer_apellido_paciente,
        paciente.segundo_apellido_paciente,
        paciente.fecha_nacimiento_paciente,
        paciente.direccion_paciente,
        paciente.email_paciente,
        paciente.telefono_paciente,
        paciente.id_genero,
        paciente.id_comuna
    ]);

    return result.insertId;
};

const actualizar = async (id_paciente, paciente) => {
    const [result] = await db.query(`
        UPDATE paciente
        SET
            dni_paciente = ?,
            nombre_paciente = ?,
            primer_apellido_paciente = ?,
            segundo_apellido_paciente = ?,
            fecha_nacimiento_paciente = ?,
            direccion_paciente = ?,
            email_paciente = ?,
            telefono_paciente = ?,
            activo_paciente = ?,
            id_genero = ?,
            id_comuna = ?
        WHERE id_paciente = ?
    `, [
        paciente.dni_paciente,
        paciente.nombre_paciente,
        paciente.primer_apellido_paciente,
        paciente.segundo_apellido_paciente,
        paciente.fecha_nacimiento_paciente,
        paciente.direccion_paciente,
        paciente.email_paciente,
        paciente.telefono_paciente,
        paciente.activo_paciente,
        paciente.id_genero,
        paciente.id_comuna,
        id_paciente
    ]);

    return result.affectedRows > 0;
};

module.exports = {
    listar,
    obtener,
    insertar,
    actualizar
};