const catalogoModel = require('../models/catalogo.model');

const generos = async (req, res) => {
    try {
        const datos = await catalogoModel.generos();

        return res.json({
            success: 1,
            datos
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener los géneros'
        });
    }
};

const regiones = async (req, res) => {
    try {
        const datos = await catalogoModel.regiones();

        return res.json({
            success: 1,
            datos
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener las regiones'
        });
    }
};

const provinciasPorRegion = async (req, res) => {
    try {
        const id_region = Number(req.params.idRegion);

        if (!Number.isInteger(id_region) || id_region <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'ID de región inválido'
            });
        }

        const datos = await catalogoModel.provinciasPorRegion(
            id_region
        );

        return res.json({
            success: 1,
            datos
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener las provincias'
        });
    }
};

const comunasPorProvincia = async (req, res) => {
    try {
        const id_provincia = Number(req.params.idProvincia);

        if (!Number.isInteger(id_provincia) || id_provincia <= 0) {
            return res.status(400).json({
                success: 0,
                message: 'ID de provincia inválido'
            });
        }

        const datos = await catalogoModel.comunasPorProvincia(
            id_provincia
        );

        return res.json({
            success: 1,
            datos
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener las comunas'
        });
    }
};

const motivos = async (req, res) => {
    try {
        const datos = await catalogoModel.motivos();

        return res.json({
            success: 1,
            datos
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            message: 'No se pudieron obtener los motivos'
        });
    }
};

module.exports = {
    generos,
    regiones,
    provinciasPorRegion,
    comunasPorProvincia,
    motivos
};