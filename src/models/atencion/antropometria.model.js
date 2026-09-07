const CitaBaseModel = require('./citaBase.model');

class AntropometriaModel extends CitaBaseModel {
    constructor() {
        super(
            'cita_antropometria',
            'id_cita_antropometria',
            [
                'peso_cita_antropometria',
                'talla_cita_antropometria',
                'imc_cita_antropometria'
            ]
        );
    }

    normalizarNumero(valor) {
        if (
            valor === null ||
            valor === undefined ||
            valor === ''
        ) {
            return null;
        }

        const numero = Number(
            String(valor)
                .trim()
                .replace(',', '.')
        );

        return Number.isFinite(numero)
            ? numero
            : null;
    }

    normalizarTallaMetros(valor) {
        const talla = this.normalizarNumero(valor);

        if (
            talla === null ||
            talla <= 0
        ) {
            return null;
        }

        /*
         * Se aceptan ambas formas:
         *
         * 1.77 -> metros
         * 1,77 -> metros
         * 177  -> centímetros
         *
         * Si la talla es mayor a 3,
         * asumimos que fue ingresada en centímetros.
         */
        if (talla > 3) {
            return talla / 100;
        }

        return talla;
    }

    calcularIMC(peso, talla) {
        const pesoNumero =
            this.normalizarNumero(peso);

        const tallaMetros =
            this.normalizarTallaMetros(talla);

        if (
            pesoNumero === null ||
            tallaMetros === null ||
            pesoNumero <= 0 ||
            tallaMetros <= 0
        ) {
            return '';
        }

        const imc =
            pesoNumero /
            (tallaMetros * tallaMetros);

        return imc.toFixed(2);
    }

    async guardar(id_cita, datos) {
        const peso =
            datos.peso_cita_antropometria ?? '';

        const talla =
            datos.talla_cita_antropometria ?? '';

        const imc = this.calcularIMC(
            peso,
            talla
        );

        return super.guardar(
            id_cita,
            {
                peso_cita_antropometria:
                    String(peso).trim(),

                talla_cita_antropometria:
                    String(talla).trim(),

                imc_cita_antropometria:
                    imc
            }
        );
    }
}

module.exports = new AntropometriaModel();