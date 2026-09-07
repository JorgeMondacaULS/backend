const db = require('../config/database');

const listarPorPaciente = async (id_paciente) => {
    const [rows] = await db.query(`
        SELECT
            c.id_cita,
            c.fecha_cita,
            c.hora_cita,
            c.estado_cita,
            c.id_paciente,
            c.id_motivo,
            m.nombre_motivo
        FROM cita c
        LEFT JOIN motivo m
            ON m.id_motivo = c.id_motivo
        WHERE c.id_paciente = ?
        ORDER BY
            c.fecha_cita DESC,
            c.hora_cita DESC
    `, [id_paciente]);

    return rows;
};

const obtener = async (id_cita) => {
    const [rows] = await db.query(`
        SELECT
            c.id_cita,
            c.fecha_cita,
            c.hora_cita,
            c.estado_cita,
            c.id_paciente,
            c.id_motivo,
            m.nombre_motivo
        FROM cita c
        LEFT JOIN motivo m
            ON m.id_motivo = c.id_motivo
        WHERE c.id_cita = ?
        LIMIT 1
    `, [id_cita]);

    return rows[0] || null;
};

const existeHorario = async (
    id_paciente,
    fecha_cita,
    hora_cita,
    excluir_id = null
) => {
    let sql = `
        SELECT id_cita
        FROM cita
        WHERE id_paciente = ?
          AND fecha_cita = ?
          AND hora_cita = ?
    `;

    const params = [
        id_paciente,
        fecha_cita,
        hora_cita
    ];

    if (excluir_id) {
        sql += ' AND id_cita != ?';
        params.push(excluir_id);
    }

    sql += ' LIMIT 1';

    const [rows] = await db.query(sql, params);

    return rows.length > 0;
};

const insertar = async ({
    id_paciente,
    id_motivo,
    fecha_cita,
    hora_cita
}) => {
    const [result] = await db.query(`
        INSERT INTO cita (
            fecha_cita,
            hora_cita,
            estado_cita,
            id_paciente,
            id_motivo
        )
        VALUES (?, ?, 'Agendada', ?, ?)
    `, [
        fecha_cita,
        hora_cita,
        id_paciente,
        id_motivo
    ]);

    return result.insertId;
};

const actualizarEstado = async (
    id_cita,
    estado_cita
) => {
    const [result] = await db.query(`
        UPDATE cita
        SET estado_cita = ?
        WHERE id_cita = ?
    `, [
        estado_cita,
        id_cita
    ]);

    return result.affectedRows > 0;
};

const reagendar = async (
    id_cita,
    fecha_cita,
    hora_cita
) => {
    const [result] = await db.query(`
        UPDATE cita
        SET
            fecha_cita = ?,
            hora_cita = ?,
            estado_cita = 'Agendada'
        WHERE id_cita = ?
    `, [
        fecha_cita,
        hora_cita,
        id_cita
    ]);

    return result.affectedRows > 0;
};

const listarPorFechaPrograma = async (
    fecha_cita,
    id_programa = null
) => {
    let sql = `
        SELECT
            c.id_cita,
            c.fecha_cita,
            c.hora_cita,
            c.estado_cita,

            p.id_paciente,
            p.dni_paciente,
            p.nombre_paciente,
            p.primer_apellido_paciente,
            p.segundo_apellido_paciente,
            p.fecha_nacimiento_paciente,

            g.nombre_genero,

            TIMESTAMPDIFF(
                YEAR,
                p.fecha_nacimiento_paciente,
                CURDATE()
            ) AS edad,

            m.id_motivo,
            m.nombre_motivo,

            GROUP_CONCAT(
                DISTINCT prog.nombre_programa
                ORDER BY prog.nombre_programa
                SEPARATOR ', '
            ) AS programas

        FROM cita c

        INNER JOIN paciente p
            ON p.id_paciente = c.id_paciente

        LEFT JOIN genero g
            ON g.id_genero = p.id_genero

        LEFT JOIN motivo m
            ON m.id_motivo = c.id_motivo

        LEFT JOIN paciente_programa pp
            ON pp.id_paciente = p.id_paciente

        LEFT JOIN programa prog
            ON prog.id_programa = pp.id_programa

        WHERE c.fecha_cita = ?
    `;

    const params = [fecha_cita];

    if (id_programa) {
        sql += `
            AND EXISTS (
                SELECT 1
                FROM paciente_programa pp2
                WHERE pp2.id_paciente = p.id_paciente
                  AND pp2.id_programa = ?
            )
        `;

        params.push(id_programa);
    }

    sql += `
        GROUP BY
            c.id_cita,
            c.fecha_cita,
            c.hora_cita,
            c.estado_cita,
            p.id_paciente,
            p.dni_paciente,
            p.nombre_paciente,
            p.primer_apellido_paciente,
            p.segundo_apellido_paciente,
            p.fecha_nacimiento_paciente,
            g.nombre_genero,
            m.id_motivo,
            m.nombre_motivo

        ORDER BY c.hora_cita ASC
    `;

    const [rows] = await db.query(sql, params);

    return rows;
};

const cabeceraAtencion = async (id_cita) => {
    const [rows] = await db.query(`
        SELECT
            c.id_cita,
            c.fecha_cita,
            c.hora_cita,
            c.estado_cita,

            p.id_paciente,
            p.dni_paciente,
            p.nombre_paciente,
            p.primer_apellido_paciente,
            p.segundo_apellido_paciente,
            p.fecha_nacimiento_paciente,

            g.nombre_genero,

            TIMESTAMPDIFF(
                YEAR,
                p.fecha_nacimiento_paciente,
                c.fecha_cita
            ) AS edad,

            m.nombre_motivo

        FROM cita c

        INNER JOIN paciente p
            ON p.id_paciente = c.id_paciente

        LEFT JOIN genero g
            ON g.id_genero = p.id_genero

        LEFT JOIN motivo m
            ON m.id_motivo = c.id_motivo

        WHERE c.id_cita = ?
        LIMIT 1
    `, [id_cita]);

    return rows[0] || null;
};

module.exports = {
    listarPorPaciente,
    obtener,
    existeHorario,
    insertar,
    actualizarEstado,
    reagendar,
    listarPorFechaPrograma,
    cabeceraAtencion
};