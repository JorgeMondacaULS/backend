const citaModel = require('../../models/cita.model');

const normalizarHora = (hora) => {
    if (!hora) {
        return null;
    }

    const valor = String(hora).trim();

    if (/^\d{2}:\d{2}$/.test(valor)) {
        return `${valor}:00`;
    }

    if (/^\d{2}:\d{2}:\d{2}$/.test(valor)) {
        return valor;
    }

    return null;
};

const listarPorPaciente = async (req, res) => {
    try {
        const id_paciente = Number(req.params.idPaciente);

        if (!Number.isInteger(id_paciente) || id_paciente <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Paciente inválido'
            });
        }

        const datos = await citaModel.listarPorPaciente(id_paciente);

        return res.json({
            success: 1,
            datos
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener las citas'
        });
    }
};

const obtener = async (req, res) => {
    try {
        const id_cita = Number(req.params.id);

        if (!Number.isInteger(id_cita) || id_cita <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Cita inválida'
            });
        }

        const cita = await citaModel.obtener(id_cita);

        if (!cita) {
            return res.status(404).json({
                success: 0,
                message: 'Cita no encontrada'
            });
        }

        return res.json({
            success: 1,
            datos: cita
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo obtener la cita'
        });
    }
};

const insertar = async (req, res) => {
    try {
        const id_paciente = Number(req.body.id_paciente);
        const id_motivo = Number(req.body.id_motivo);
        const fecha_cita = req.body.fecha_cita;
        const hora_cita = normalizarHora(req.body.hora_cita);

        if (!Number.isInteger(id_paciente) || id_paciente <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Paciente inválido'
            });
        }

        if (!Number.isInteger(id_motivo) || id_motivo <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Motivo inválido'
            });
        }

        if (!fecha_cita) {
            return res.status(400).json({
                success: 0,
                message: 'La fecha es requerida'
            });
        }

        if (!hora_cita) {
            return res.status(400).json({
                success: 0,
                message: 'La hora es inválida'
            });
        }

        const existe = await citaModel.existeHorario(
            id_paciente,
            fecha_cita,
            hora_cita
        );

        if (existe) {
            return res.status(409).json({
                success: 0,
                message: 'El paciente ya tiene una cita en ese horario'
            });
        }

        const id = await citaModel.insertar({
            id_paciente,
            id_motivo,
            fecha_cita,
            hora_cita
        });

        return res.status(201).json({
            success: 1,
            id
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo crear la cita'
        });
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const id_cita = Number(req.params.id);
        const estado_cita = req.body.estado_cita?.trim();

        if (!Number.isInteger(id_cita) || id_cita <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Cita inválida'
            });
        }

        if (!estado_cita) {
            return res.status(400).json({
                success: 0,
                message: 'El estado es requerido'
            });
        }

        const ok = await citaModel.actualizarEstado(
            id_cita,
            estado_cita
        );

        if (!ok) {
            return res.status(404).json({
                success: 0,
                message: 'Cita no encontrada'
            });
        }

        return res.json({
            success: 1
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo actualizar el estado de la cita'
        });
    }
};

const reagendar = async (req, res) => {
    try {
        const id_cita = Number(req.params.id);
        const fecha_cita = req.body.fecha_cita;
        const hora_cita = normalizarHora(req.body.hora_cita);

        if (!Number.isInteger(id_cita) || id_cita <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Cita inválida'
            });
        }

        if (!fecha_cita || !hora_cita) {
            return res.status(400).json({
                success: 0,
                message: 'Fecha y hora son requeridas'
            });
        }

        const cita = await citaModel.obtener(id_cita);

        if (!cita) {
            return res.status(404).json({
                success: 0,
                message: 'Cita no encontrada'
            });
        }

        const existe = await citaModel.existeHorario(
            cita.id_paciente,
            fecha_cita,
            hora_cita,
            id_cita
        );

        if (existe) {
            return res.status(409).json({
                success: 0,
                message: 'El paciente ya tiene otra cita en ese horario'
            });
        }

        await citaModel.reagendar(
            id_cita,
            fecha_cita,
            hora_cita
        );

        return res.json({
            success: 1
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo reagendar la cita'
        });
    }
};

const listarAgenda = async (req, res) => {
    try {
        const fecha_cita = req.query.fecha;

        const id_programa = req.query.id_programa
            ? Number(req.query.id_programa)
            : null;

        if (!fecha_cita) {
            return res.status(400).json({
                success: 0,
                message: 'La fecha es requerida'
            });
        }

        if (
            id_programa !== null &&
            (!Number.isInteger(id_programa) || id_programa <= 0)
        ) {
            return res.status(400).json({
                success: 0,
                message: 'Programa inválido'
            });
        }

        const datos = await citaModel.listarPorFechaPrograma(
            fecha_cita,
            id_programa
        );

        return res.json({
            success: 1,
            datos
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo obtener la agenda'
        });
    }
};

const cabeceraAtencion = async (req, res) => {
    try {
        const id_cita = Number(req.params.id);

        if (!Number.isInteger(id_cita) || id_cita <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'Cita inválida'
            });
        }

        const datos = await citaModel.cabeceraAtencion(id_cita);

        if (!datos) {
            return res.status(404).json({
                success: 0,
                message: 'Cita no encontrada'
            });
        }

        return res.json({
            success: 1,
            datos
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo obtener la cabecera de atención'
        });
    }
};

module.exports = {
    listarPorPaciente,
    obtener,
    insertar,
    cambiarEstado,
    reagendar,
    listarAgenda,
    cabeceraAtencion
};