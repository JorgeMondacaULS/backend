const db = require('../../config/database');

class CitaBaseModel {
    constructor(table, primaryKey, fields) {
        this.table = table;
        this.primaryKey = primaryKey;
        this.fields = fields;
    }

    async obtenerPorCita(id_cita) {
        const [rows] = await db.query(
            `
            SELECT *
            FROM ${this.table}
            WHERE id_cita = ?
            LIMIT 1
            `,
            [id_cita]
        );

        return rows[0] || null;
    }

    async guardar(id_cita, datos) {
        const existente = await this.obtenerPorCita(id_cita);

        const campos = this.fields.filter(
            campo => Object.prototype.hasOwnProperty.call(datos, campo)
        );

        if (existente) {
            if (campos.length === 0) {
                return existente[this.primaryKey];
            }

            const set = campos
                .map(campo => `${campo} = ?`)
                .join(', ');

            const valores = campos.map(
                campo => datos[campo]
            );

            valores.push(existente[this.primaryKey]);

            await db.query(
                `
                UPDATE ${this.table}
                SET ${set}
                WHERE ${this.primaryKey} = ?
                `,
                valores
            );

            return existente[this.primaryKey];
        }

        const columnas = [
            'id_cita',
            ...campos
        ];

        const placeholders = columnas
            .map(() => '?')
            .join(', ');

        const valores = [
            id_cita,
            ...campos.map(campo => datos[campo])
        ];

        const [result] = await db.query(
            `
            INSERT INTO ${this.table} (
                ${columnas.join(', ')}
            )
            VALUES (${placeholders})
            `,
            valores
        );

        return result.insertId;
    }
}

module.exports = CitaBaseModel;