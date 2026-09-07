const patologiaModel = require('../../models/patologia.model');

const listar = async (req, res) => {
    try {
        const patologias = await patologiaModel.listar();

        return res.json({
            success: 1,
            datos: patologias
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener las patologías'
        });
    }
};

const obtener = async (req, res) => {
    try {
        const id_patologia = Number(req.params.id);

        if (!Number.isInteger(id_patologia) || id_patologia <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'ID de patología inválido'
            });
        }

        const patologia = await patologiaModel.obtener(id_patologia);

        if (!patologia) {
            return res.status(404).json({
                success: 0,
                message: 'Patología no encontrada'
            });
        }

        return res.json({
            success: 1,
            datos: patologia
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo obtener la patología'
        });
    }
};

const insertar = async (req, res) => {
    try {
        const nombre_patologia = req.body.nombre_patologia?.trim();
        const id_categoria = Number(req.body.id_categoria);

        if (!nombre_patologia) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre de la patología es requerido'
            });
        }

        if (nombre_patologia.length < 3 || nombre_patologia.length > 45) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre debe tener entre 3 y 45 caracteres'
            });
        }

        if (!Number.isInteger(id_categoria) || id_categoria <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'La categoría es requerida'
            });
        }

        const id = await patologiaModel.insertar(
            nombre_patologia,
            id_categoria
        );

        return res.status(201).json({
            success: 1,
            id
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo crear la patología'
        });
    }
};

const actualizar = async (req, res) => {
    try {
        const id_patologia = Number(req.params.id);
        const nombre_patologia = req.body.nombre_patologia?.trim();
        const id_categoria = Number(req.body.id_categoria);

        const activo_patologia =
            req.body.activo_patologia === true ||
            req.body.activo_patologia === 1 ||
            req.body.activo_patologia === '1'
                ? 1
                : 0;

        if (!Number.isInteger(id_patologia) || id_patologia <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'ID de patología inválido'
            });
        }

        if (!nombre_patologia) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre de la patología es requerido'
            });
        }

        if (nombre_patologia.length < 3 || nombre_patologia.length > 45) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre debe tener entre 3 y 45 caracteres'
            });
        }

        if (!Number.isInteger(id_categoria) || id_categoria <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'La categoría es requerida'
            });
        }

        const ok = await patologiaModel.actualizar(
            id_patologia,
            nombre_patologia,
            id_categoria,
            activo_patologia
        );

        if (!ok) {
            return res.status(404).json({
                success: 0,
                message: 'Patología no encontrada'
            });
        }

        return res.json({
            success: 1
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo actualizar la patología'
        });
    }
};

const listarPorCategoria = async (req, res) => {
    try {
        const id_categoria = Number(req.params.idCategoria);

        if (!Number.isInteger(id_categoria) || id_categoria <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'ID de categoría inválido'
            });
        }

        const patologias = await patologiaModel.listarPorCategoria(id_categoria);

        return res.json({
            success: 1,
            datos: patologias
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener las patologías'
        });
    }
};

module.exports = {
    listar,
    obtener,
    insertar,
    actualizar,
    listarPorCategoria
};