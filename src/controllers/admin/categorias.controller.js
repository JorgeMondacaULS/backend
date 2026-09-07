const categoriasModel = require('../../models/categorias.model');

const listar = async (req, res) => {
    try {
        const categorias = await categoriasModel.listar();

        return res.json({
            success: 1,
            datos: categorias
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener las categorías'
        });
    }
};

const obtener = async (req, res) => {
    try {
        const id_categoria = Number(req.params.id);

        if (!Number.isInteger(id_categoria) || id_categoria <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'ID de categoría inválido'
            });
        }

        const categoria = await categoriasModel.obtener(id_categoria);

        if (!categoria) {
            return res.status(404).json({
                success: 0,
                message: 'Categoría no encontrada'
            });
        }

        return res.json({
            success: 1,
            datos: categoria
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo obtener la categoría'
        });
    }
};

const insertar = async (req, res) => {
    try {
        const nombre_categoria = req.body.nombre_categoria?.trim();

        if (!nombre_categoria) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre de la categoría es requerido'
            });
        }

        if (nombre_categoria.length < 3 || nombre_categoria.length > 45) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre debe tener entre 3 y 45 caracteres'
            });
        }

        const id = await categoriasModel.insertar(nombre_categoria);

        return res.status(201).json({
            success: 1,
            id
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo crear la categoría'
        });
    }
};

const actualizar = async (req, res) => {
    try {
        const id_categoria = Number(req.params.id);
        const nombre_categoria = req.body.nombre_categoria?.trim();

        const activo_categoria =
            req.body.activo_categoria === true ||
            req.body.activo_categoria === 1 ||
            req.body.activo_categoria === '1'
                ? 1
                : 0;

        if (!Number.isInteger(id_categoria) || id_categoria <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'ID de categoría inválido'
            });
        }

        if (!nombre_categoria) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre de la categoría es requerido'
            });
        }

        if (nombre_categoria.length < 3 || nombre_categoria.length > 45) {
            return res.status(400).json({
                success: 0,
                message: 'El nombre debe tener entre 3 y 45 caracteres'
            });
        }

        const ok = await categoriasModel.actualizar(
            id_categoria,
            nombre_categoria,
            activo_categoria
        );

        if (!ok) {
            return res.status(404).json({
                success: 0,
                message: 'Categoría no encontrada'
            });
        }

        return res.json({
            success: 1
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudo actualizar la categoría'
        });
    }
};

module.exports = {
    listar,
    obtener,
    insertar,
    actualizar
};