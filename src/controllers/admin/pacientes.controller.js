const pacienteModel = require('../../models/paciente.model');

const listar = async (req, res) => {
    try {
        const pacientes = await pacienteModel.listar();

        return res.json({
            success: 1,
            datos: pacientes
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener los pacientes'
        });
    }
};

const obtener = async (req, res) => {
    try {
        const id_paciente = Number(req.params.id);

        if (!Number.isInteger(id_paciente) || id_paciente <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'ID de paciente inválido'
            });
        }

        const paciente = await pacienteModel.obtener(id_paciente);

        if (!paciente) {
            return res.status(404).json({
                success: 0,
                message: 'Paciente no encontrado'
            });
        }

        return res.json({
            success: 1,
            datos: paciente
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo obtener el paciente'
        });
    }
};

const insertar = async (req, res) => {
    try {
        const paciente = prepararPaciente(req.body);

        if (!paciente.dni_paciente) {
            return res.status(400).json({
                success: 0,
                message: 'El identificador del paciente es requerido'
            });
        }

        if (!paciente.nombre_paciente) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre del paciente es requerido'
            });
        }

        if (!paciente.primer_apellido_paciente) {
            return res.status(400).json({
                success: 0,
                message: 'El primer apellido es requerido'
            });
        }

        if (!paciente.fecha_nacimiento_paciente) {
            return res.status(400).json({
                success: 0,
                message: 'La fecha de nacimiento es requerida'
            });
        }

        if (!paciente.id_genero) {
            return res.status(400).json({
                success: 0,
                message: 'El género es requerido'
            });
        }

        if (!paciente.id_comuna) {
            return res.status(400).json({
                success: 0,
                message: 'La comuna es requerida'
            });
        }

        const id = await pacienteModel.insertar(paciente);

        return res.status(201).json({
            success: 1,
            id
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo crear el paciente'
        });
    }
};

const actualizar = async (req, res) => {
    try {
        const id_paciente = Number(req.params.id);

        if (!Number.isInteger(id_paciente) || id_paciente <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'ID de paciente inválido'
            });
        }

        const paciente = prepararPaciente(req.body);

        if (
            !paciente.dni_paciente ||
            !paciente.nombre_paciente ||
            !paciente.primer_apellido_paciente ||
            !paciente.fecha_nacimiento_paciente ||
            !paciente.id_genero ||
            !paciente.id_comuna
        ) {
            return res.status(400).json({
                success: 0,
                message: 'Faltan datos obligatorios del paciente'
            });
        }

        const ok = await pacienteModel.actualizar(
            id_paciente,
            paciente
        );

        if (!ok) {
            return res.status(404).json({
                success: 0,
                message: 'Paciente no encontrado'
            });
        }

        return res.json({
            success: 1
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo actualizar el paciente'
        });
    }
};

const prepararPaciente = (body) => ({
    dni_paciente: body.dni_paciente?.trim(),
    nombre_paciente: body.nombre_paciente?.trim(),
    primer_apellido_paciente: body.primer_apellido_paciente?.trim(),
    segundo_apellido_paciente: body.segundo_apellido_paciente?.trim() || null,
    fecha_nacimiento_paciente: body.fecha_nacimiento_paciente || null,
    direccion_paciente: body.direccion_paciente?.trim() || null,
    email_paciente: body.email_paciente?.trim() || null,
    telefono_paciente: body.telefono_paciente?.trim() || null,

    activo_paciente:
        body.activo_paciente === false ||
        body.activo_paciente === 0 ||
        body.activo_paciente === '0'
            ? 0
            : 1,

    id_genero: Number(body.id_genero) || null,
    id_comuna: Number(body.id_comuna) || null
});

module.exports = {
    listar,
    obtener,
    insertar,
    actualizar
};