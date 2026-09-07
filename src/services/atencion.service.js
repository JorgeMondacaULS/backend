const db = require('../config/database');

const obtenerCompletitudConConexion = async (conexion, id_cita) => {
    const [rows] = await conexion.query(
        `
        SELECT
            c.id_cita,
            c.estado_cita,

            EXISTS(
                SELECT 1
                FROM cita_signos
                WHERE id_cita = c.id_cita
            ) AS signos,

            EXISTS(
                SELECT 1
                FROM cita_antropometria
                WHERE id_cita = c.id_cita
            ) AS antropometria,

            EXISTS(
                SELECT 1
                FROM cita_motivo
                WHERE id_cita = c.id_cita
            ) AS motivo,

            EXISTS(
                SELECT 1
                FROM cita_anamnesis
                WHERE id_cita = c.id_cita
            ) AS anamnesis,

            EXISTS(
                SELECT 1
                FROM cita_exploracion
                WHERE id_cita = c.id_cita
            ) AS exploracion,

            EXISTS(
                SELECT 1
                FROM cita_diagnostico
                WHERE id_cita = c.id_cita
            ) AS diagnostico,

            EXISTS(
                SELECT 1
                FROM cita_actuacion
                WHERE id_cita = c.id_cita
            ) AS actuacion

        FROM cita c
        WHERE c.id_cita = ?
        LIMIT 1
        `,
        [id_cita]
    );

    if (rows.length === 0) {
        return null;
    }

    const fila = rows[0];

    const bloques = {
        signos: Boolean(fila.signos),
        antropometria: Boolean(fila.antropometria),
        motivo: Boolean(fila.motivo),
        anamnesis: Boolean(fila.anamnesis),
        exploracion: Boolean(fila.exploracion),
        diagnostico: Boolean(fila.diagnostico),
        actuacion: Boolean(fila.actuacion)
    };

    const completa = Object.values(bloques).every(Boolean);

    return {
        id_cita: fila.id_cita,
        estado_cita: fila.estado_cita,
        bloques,
        completa
    };
};

const obtenerCompletitud = async (id_cita) => {
    return obtenerCompletitudConConexion(
        db,
        id_cita
    );
};

const cerrarAtencion = async (id_cita) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [citas] = await connection.query(
            `
            SELECT id_cita, estado_cita
            FROM cita
            WHERE id_cita = ?
            LIMIT 1
            FOR UPDATE
            `,
            [id_cita]
        );

        if (citas.length === 0) {
            await connection.rollback();

            return {
                success: false,
                status: 404,
                message: 'La cita no existe'
            };
        }

        const cita = citas[0];

        if (cita.estado_cita === 'Realizada') {
            await connection.commit();

            return {
                success: true,
                ya_realizada: true,
                message: 'La atención ya se encontraba cerrada'
            };
        }

        const completitud =
            await obtenerCompletitudConConexion(
                connection,
                id_cita
            );

        if (!completitud.completa) {
            await connection.rollback();

            return {
                success: false,
                status: 409,
                message: 'La atención está incompleta',
                completitud
            };
        }

        await connection.query(
            `
            UPDATE cita
            SET estado_cita = 'Realizada'
            WHERE id_cita = ?
            `,
            [id_cita]
        );

        await connection.commit();

        return {
            success: true,
            ya_realizada: false,
            message: 'Atención cerrada correctamente'
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
};

module.exports = {
    obtenerCompletitud,
    cerrarAtencion
};