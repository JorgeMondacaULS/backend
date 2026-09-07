const programaModel = require('../../models/programa.model');

const listar = async (req, res) => {
    try {
        const datos = await programaModel.listar();

        return res.json({
            success: 1,
            datos
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener los programas'
        });
    }
};

const listarActivos = async (req, res) => {
    try {
        const datos = await programaModel.listarActivos();

        return res.json({
            success: 1,
            datos
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener los programas activos'
        });
    }
};

const obtener = async (req, res) => {
    try {
        const id_programa = Number(req.params.id);

        if (!Number.isInteger(id_programa) || id_programa <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'ID de programa inválido'
            });
        }

        const programa = await programaModel.obtener(id_programa);

        if (!programa) {
            return res.status(404).json({
                success: 0,
                message: 'Programa no encontrado'
            });
        }

        return res.json({
            success: 1,
            datos: programa
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo obtener el programa'
        });
    }
};

const insertar = async (req, res) => {
    try {
        const nombre_programa = req.body.nombre_programa?.trim();

        if (!nombre_programa) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre del programa es requerido'
            });
        }

        if (nombre_programa.length < 3 || nombre_programa.length > 45) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre debe tener entre 3 y 45 caracteres'
            });
        }

        const id = await programaModel.insertar(nombre_programa);

        return res.status(201).json({
            success: 1,
            id
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo crear el programa'
        });
    }
};

const actualizar = async (req, res) => {
    try {
        const id_programa = Number(req.params.id);
        const nombre_programa = req.body.nombre_programa?.trim();

        const activo_programa =
            req.body.activo_programa === true ||
            req.body.activo_programa === 1 ||
            req.body.activo_programa === '1'
                ? 1
                : 0;

        if (!Number.isInteger(id_programa) || id_programa <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'ID de programa inválido'
            });
        }

        if (!nombre_programa) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre del programa es requerido'
            });
        }

        if (nombre_programa.length < 3 || nombre_programa.length > 45) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre debe tener entre 3 y 45 caracteres'
            });
        }

        const ok = await programaModel.actualizar(
            id_programa,
            nombre_programa,
            activo_programa
        );

        if (!ok) {
            return res.status(404).json({
                success: 0,
                message: 'Programa no encontrado'
            });
        }

        return res.json({
            success: 1
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo actualizar el programa'
        });
    }
};

module.exports = {
    listar,
    listarActivos,
    obtener,
    insertar,
    actualizar
};