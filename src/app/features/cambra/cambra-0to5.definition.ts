import { CambraFormDefinition } from '../../core/models/cambra-form.model';

/**
 * CAMBRA Questionnaire for ages 0 to 5 years.
 *
 * Scoring:
 *  - A = sum of "Sí" in sectors 1, 2, 5 (highlighted items = 2 pts, others = 1 pt)
 *  - B = sum of "Sí" in sectors 3, 4 (1 pt each)
 *  - Total = A - B
 *  - Low risk: -5 to 5 pts | High risk: 6 to 18 pts
 */
export const CAMBRA_0TO5_DEFINITION: CambraFormDefinition = {
    // Sectors 1 + 5 → disease indicators (sector 1: caries history, sector 5: clinical signs)
    diseaseIndicators: [
        // ── Sector 1: Antecedentes de caries ──
        {
            id: '1a',
            label: '¿Ha tenido la madre o cuidador principal caries en el último año?',
            isHighlighted: true,
            sector: 1,
        },
        {
            id: '1b',
            label: '¿Se le ha realizado al niño alguna obturación recientemente?',
            isHighlighted: true,
            sector: 1,
        },
        {
            id: '1c',
            label: '¿Tiene la madre o cuidador principal nivel socioeconómico o cultural bajo?',
            sector: 1,
        },
        {
            id: '1d',
            label: '¿Tiene problemas de desarrollo?',
            sector: 1,
        },
        {
            id: '1e',
            label: '¿No realiza visitas al dentista de forma periódica?',
            sector: 1,
        },
        // ── Sector 5: Indicadores clínicos ──
        {
            id: '5a',
            label: 'El niño presenta lesiones blancas, descalcificaciones o caries',
            isHighlighted: true,
            sector: 5,
        },
        {
            id: '5b',
            label: 'Se han realizado obturaciones al niño en los últimos dos años',
            isHighlighted: true,
            sector: 5,
        },
        {
            id: '5c',
            label: '¿Presenta placa de forma clara y/o las encías sangran fácilmente?',
            sector: 5,
        },
        {
            id: '5d',
            label: '¿El niño es portador de ortodoncia?',
            sector: 5,
        },
        {
            id: '5e',
            label: '¿Se observa visualmente un flujo salival deficiente?',
            sector: 5,
        },
    ],

    // Sector 2 → risk factors
    riskFactors: [
        {
            id: '2a',
            label: '¿Toma snacks o bebidas azucarados entre horas más de tres veces diarias?',
            sector: 2,
        },
        {
            id: '2b',
            label: '¿Tiene reducción de la producción de saliva por medicación u otras causas?',
            sector: 2,
        },
        {
            id: '2c',
            label: '¿Bebe habitualmente en botella o biberón bebidas que no sean agua?',
            sector: 2,
        },
        {
            id: '2d',
            label: '¿Duerme con biberón o toma pecho a demanda mientras duerme?',
            sector: 2,
        },
    ],

    // Sectors 3 + 4 → protective factors
    protectiveFactors: [
        // ── Sector 3: Factores protectores personales ──
        {
            id: '3a',
            label: 'La madre o cuidador no ha tenido caries en los últimos tres años',
            sector: 3,
        },
        {
            id: '3b',
            label: 'Realiza revisiones y controles periódicos con un dentista',
            sector: 3,
        },
        // ── Sector 4: Factores protectores adicionales ──
        {
            id: '4a',
            label: 'Vive en una área con agua fluorada o deshace en boca comprimidos fluorados',
            sector: 4,
        },
        {
            id: '4b',
            label: 'Se cepilla con pasta fluorada diariamente (tamaño lenteja o guisante)',
            sector: 4,
        },
        {
            id: '4c',
            label: 'La madre utiliza chicles o pastillas con xylitol 2-4 veces al día',
            sector: 4,
        },
    ],
};
