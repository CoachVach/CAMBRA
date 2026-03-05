import { CambraFormDefinition } from '../../core/models/cambra-form.model';

export const CAMBRA_6PLUS_DEFINITION: CambraFormDefinition = {
  diseaseIndicators: [
    {
      id: 'active-caries',
      label: 'Lesiones de caries cavitadas activas',
    },
    {
      id: 'recent-restorations',
      label: 'Restauraciones recientes por caries',
    },
    {
      id: 'white-spots',
      label: 'Lesiones de mancha blanca activas',
    },
    {
      id: 'caries-pain',
      label: 'Dolor dental relacionado con caries',
    },
  ],

  riskFactors: [
    {
      id: 'high-sugar',
      label: 'Alta frecuencia de consumo de azúcares',
    },
    {
      id: 'poor-hygiene',
      label: 'Higiene oral deficiente',
    },
    {
      id: 'low-saliva',
      label: 'Flujo salival reducido',
      requiresTest: true,
    },
    {
      id: 'high-sm',
      label: 'Recuento elevado de Streptococcus mutans',
      requiresTest: true,
    },
  ],

  protectiveFactors: [
    {
      id: 'fluoride-toothpaste',
      label: 'Uso diario de pasta fluorada',
    },
    {
      id: 'sealants',
      label: 'Selladores de fosas y fisuras presentes',
    },
    {
      id: 'professional-fluoride',
      label: 'Aplicaciones profesionales de flúor',
    },
    {
      id: 'diet-control',
      label: 'Control dietario adecuado',
    },
  ],
};
