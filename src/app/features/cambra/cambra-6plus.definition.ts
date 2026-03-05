import { CambraFormDefinition } from '../../core/models/cambra-form.model';

/**
 * CAMBRA Questionnaire for ages 6 and older.
 *
 * Scoring:
 *  - A (disease indicators) × 2 points each
 *  - B (risk factors) × 1 point each
 *  - C (protective factors) × 1 point (subtracted)
 *  - Total = A×2 + B - C
 *  - Low risk: -9 to 4 pts | High risk: 5 to 18 pts
 */
export const CAMBRA_6PLUS_DEFINITION: CambraFormDefinition = {
  // (A) Indicadores de la Enfermedad
  diseaseIndicators: [
    {
      id: 'caries-dentin',
      label: 'Lesiones de caries en dentina (diagnóstico visual o radiográfico)',
    },
    {
      id: 'caries-enamel',
      label: 'Lesiones de caries en esmalte (diagnóstico visual, Diagnocam o radiográfico)',
    },
    {
      id: 'white-spots',
      label: 'Lesiones blancas de caries en superficies lisas',
    },
    {
      id: 'restorations-3yr',
      label: 'Obturaciones realizadas en los últimos tres años',
    },
  ],

  // (B) Factores de Riesgo
  riskFactors: [
    {
      id: 'plaque',
      label: 'Gran cantidad de placa en los dientes',
    },
    {
      id: 'saliva-reducing',
      label: 'Factores que reducen el flujo salival (medicación, radiación, enfermedad)',
    },
    {
      id: 'low-stimulated-flow',
      label: 'Flujo salival estimulado inadecuado (por observación o por medición menor a 1 ml/minuto)',
    },
    {
      id: 'snacking',
      label: 'Consumo mayor a tres ingestas entre horas (picoteo)',
    },
    {
      id: 'exposed-roots',
      label: 'Raíces expuestas',
    },
    {
      id: 'fixed-ortho',
      label: 'En tratamiento de ortodoncia fija',
    },
    {
      id: 'deep-fissures',
      label: 'Fosas y fisuras oclusales profundas',
    },
    {
      id: 'drug-use',
      label: 'Usuario de drogas de diseño',
    },
    {
      id: 'bacteria-test',
      label: 'Prueba: Cultivo de lactobacilos y de estreptococos con nivel medio o alto',
      requiresTest: true,
    },
    {
      id: 'buffering-test',
      label: 'Prueba: Baja capacidad tampón de la saliva',
      requiresTest: true,
    },
  ],

  // (C) Factores Protectores
  protectiveFactors: [
    {
      id: 'fluoridated-water',
      label: 'Vive en una área con agua fluorada',
    },
    {
      id: 'fluoride-rinse',
      label: 'Utiliza un enjuague fluorado diariamente',
    },
    {
      id: 'fluoride-paste-1x',
      label: 'Se cepilla con pasta fluorada como mínimo una vez al día',
    },
    {
      id: 'fluoride-paste-2x',
      label: 'Se cepilla con pasta fluorada como mínimo dos veces al día',
    },
    {
      id: 'fluoride-paste-5000',
      label: 'Se cepilla diariamente con una pasta dental fluorada con 5000 PPM de flúor',
    },
    {
      id: 'arginine-paste',
      label: 'Utiliza una pasta dental que contiene un 1,5% de arginina',
    },
    {
      id: 'chx-varnish',
      label: 'Recibe una aplicación semestral de barniz de clorhexidina y timol',
    },
    {
      id: 'professional-fluoride',
      label: 'Recibe una aplicación semestral de barniz o gel profesional de flúor',
    },
    {
      id: 'xylitol',
      label: 'Ha tomado 1 mgr de xylitol 5 veces al día durante los últimos seis meses',
    },
  ],
};
