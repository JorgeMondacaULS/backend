const db = require('../config/database');

const listarPorPaciente = async (id_paciente) => {
    const [rows] = await db.query(`
        SELECT
            pp.id_paciente,
            pp.id_programa,
            p.nombre_programa
        FROM paciente_programa pp
        INNER JOIN programa p
            ON p.id_programa = pp.id_programa
        WHERE pp.id_paciente = ?
        ORDER BY p.nombre_programa ASC
    `, [id_paciente]);

    return rows;
};

const reemplazar = async (id_paciente, programas) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(`
            DELETE FROM paciente_programa
            WHERE id_paciente = ?
        `, [id_paciente]);

        for (const id_programa of programas) {
            await connection.query(`
                INSERT INTO paciente_programa (
                    id_paciente,
                    id_programa
                )
                VALUES (?, ?)
            `, [
                id_paciente,
                id_programa
            ]);
        }

        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
};

module.exports = {
    listarPorPaciente,
    reemplazar
};