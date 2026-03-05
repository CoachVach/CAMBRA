# CAMBRA Web – Frontend Angular

## Descripción general

Este proyecto es una **aplicación web frontend desarrollada en Angular** cuyo objetivo es facilitar la **evaluación del riesgo de caries mediante el método CAMBRA**, respetando los cuestionarios oficiales según **grupo etario (0–5 años y ≥6 años)**.

La aplicación está pensada para **uso clínico**, priorizando:
- simplicidad,
- rapidez de uso en consultorio,
- reducción de errores de cálculo,
- y una experiencia clara para el profesional.

En esta primera etapa, el proyecto es **solo frontend**, sin backend ni persistencia remota.

---

## Objetivo del proyecto

Implementar una aplicación que permita:

- Determinar primero el **grupo etario del paciente**.
- Mostrar el **cuestionario CAMBRA correspondiente** según la edad.
- Completar el cuestionario CAMBRA:
  - Indicadores de enfermedad
  - Factores de riesgo
  - Factores protectores
- Calcular automáticamente el **puntaje total CAMBRA**.
- Determinar el **riesgo global de caries (Bajo / Alto)** según las reglas oficiales.
- Mostrar recomendaciones clínicas y sugerencias de seguimiento basadas en el riesgo.
- Mantener una estructura limpia, escalable y fácil de extender en el futuro.

---

## Stack tecnológico

- **Angular (CLI moderno, standalone)**
- **TypeScript**
- **SCSS**
- SPA clásica (sin SSR, sin zoneless)
- Sin backend

---

## Estructura del proyecto

Dentro de `src/app` se definió la siguiente estructura base:

app/
├── core/
│ ├── models/
│ └── services/
│
├── features/
│ └── cambra/
│ ├── components/
│ ├── pages/
│ ├── cambra-6plus.definition.ts
│ └── cambra.routes.ts
│
├── shared/
│ └── components/
│
├── app.routes.ts
└── app.component.ts


Esta organización separa claramente:
- **Modelos, reglas y estado global** (`core`)
- **Flujo funcional CAMBRA** (`features/cambra`)
- **Componentes reutilizables** (`shared`)

---

## Flujo funcional general

1. El profesional ingresa la **edad del paciente**.
2. El sistema determina el **grupo etario**:
   - `0–5 años`
   - `≥6 años`
3. Según el grupo etario:
   - Se muestra el **formulario CAMBRA correspondiente**.
4. El cuestionario se completa marcando únicamente respuestas afirmativas.
5. El sistema calcula automáticamente el puntaje y el riesgo.
6. Se muestran resultados, recomendaciones y seguimiento.

Este flujo replica fielmente la lógica del documento CAMBRA oficial.

---

## Ruteo configurado

- La aplicación redirige automáticamente a `/cambra`.
- El flujo CAMBRA se carga mediante **lazy loading**.
- Existe una página principal `CambraPage` que actúa como **orquestador del flujo completo**.

---

## Modelos implementados (`core/models`)

- `age-group.model.ts`
  - Define los grupos etarios: `AGE_0_5 | AGE_6_PLUS`

- `patient.model.ts`
  - Información básica del paciente (edad, grupo etario)

- `cambra-item.model.ts`
  - Define un ítem del cuestionario CAMBRA

- `cambra-form.model.ts`
  - Define la estructura del formulario CAMBRA

- `cambra-result.model.ts`
  - Define el resultado del cálculo CAMBRA (puntajes y riesgo)

---

## Servicios implementados (`core/services`)

- `cambra-state.service.ts`
  - Determina el grupo etario a partir de la edad
  - Controla qué formulario debe mostrarse
  - Permite reiniciar el flujo

- `cambra-calculation.service.ts`
  - Implementa **toda la lógica de cálculo CAMBRA ≥6**
  - Calcula:
    - Puntaje de indicadores de enfermedad (+2)
    - Puntaje de factores de riesgo (+1)
    - Puntaje de factores protectores (−1)
    - Puntaje total
    - Riesgo global (Bajo / Alto)
  - No depende de UI ni componentes

---

## Definición clínica CAMBRA ≥6 años

- `features/cambra/cambra-6plus.definition.ts`
  - Contiene los **ítems reales del cuestionario CAMBRA ≥6**
  - Separados en:
    - Indicadores de enfermedad
    - Factores de riesgo (incluyendo los que requieren prueba)
    - Factores protectores
  - Funciona como fuente única de verdad clínica

---

## Componentes implementados (estado actual)

Todos los componentes son **standalone** y **sin estilos**.

### Página principal

- `CambraPage`
  - Controla el flujo general
  - Decide qué formulario mostrar según el grupo etario

---

### Componentes funcionales

- `PatientInfo`
  - Paso inicial obligatorio
  - Solicita la edad del paciente
  - Define el grupo etario mediante `CambraStateService`

- `CambraForm`
  - Implementado con **Reactive Forms**
  - Renderiza el cuestionario CAMBRA ≥6
  - Usa `FormArray` para A / B / C
  - Recalcula automáticamente el puntaje al cambiar el formulario
  - Consume `CambraCalculationService`

- `ScoreSummary`
  - Preparado para mostrar el desglose del puntaje (no conectado aún)

- `RiskResult`
  - Preparado para mostrar el riesgo global (no conectado aún)

- `Recommendations`
  - Preparado para mostrar recomendaciones clínicas (no conectado aún)

- `FollowUp`
  - Preparado para mostrar sugerencias de seguimiento (no conectado aún)

---

## Estado actual del proyecto

✅ Proyecto Angular creado y configurado  
✅ SPA clásica (sin SSR ni zoneless)  
✅ Routing principal y lazy loading CAMBRA  
✅ Estructura de carpetas definida  
✅ Flujo etario implementado (edad → formulario)  
✅ Estado global de aplicación implementado  
✅ Reactive Forms implementados  
✅ Ítems CAMBRA ≥6 definidos  
✅ Servicio de cálculo CAMBRA implementado  
✅ Recalculo automático del puntaje en cada cambio  

---

## Próximos pasos pendientes

### Integración de resultados (siguiente paso lógico)
- Conectar `CambraForm` con:
  - `ScoreSummary`
  - `RiskResult`
- Mostrar en pantalla:
  - Puntaje total
  - Desglose A / B / C
  - Riesgo Bajo / Alto

### Lógica adicional
- Implementar la regla especial:
  - Puntajes 0–4 + prueba bacteriana positiva ⇒ Riesgo Alto

### Pendiente específico
- Implementar el **formulario CAMBRA 0–5 años** (estructura independiente)

### UI / UX (más adelante)
- Diseño visual clínico
- Checkboxes claros
- Tooltips para factores que requieren pruebas
- Indicadores visuales de riesgo

### Mejoras futuras
- Exportar evaluación a PDF
- Guardado local (localStorage)
- Comparación entre evaluaciones
- Internacionalización
- Persistencia backend

---

## Nota final

El proyecto se está construyendo **desde el flujo clínico correcto hacia la implementación técnica**, priorizando corrección, claridad y mantenibilidad.  
La base actual es sólida, alineada con CAMBRA y preparada para crecer sin refactors mayores.

app/
├── core/
│ ├── models/
│ └── services/
│
├── features/
│ └── cambra/
│ ├── components/
│ ├── pages/
│ ├── cambra-6plus.definition.ts
│ └── cambra.routes.ts
│
├── shared/
│ └── components/
│
├── app.routes.ts
└── app.component.ts


Esta organización separa claramente:
- **Modelos, reglas clínicas y estado global** (`core`)
- **Flujo funcional CAMBRA** (`features/cambra`)
- **Componentes reutilizables** (`shared`)

---

## Flujo funcional general

1. El profesional ingresa la **edad del paciente**.
2. El sistema determina el **grupo etario**:
   - `0–5 años`
   - `≥6 años`
3. Según el grupo etario:
   - Se muestra el **formulario CAMBRA correspondiente**.
4. El cuestionario se completa marcando únicamente respuestas afirmativas.
5. El sistema recalcula automáticamente:
   - puntajes parciales,
   - puntaje total,
   - riesgo global.
6. Se muestran los resultados clínicos en tiempo real.

Este flujo replica fielmente la lógica del documento CAMBRA oficial.

---

## Ruteo configurado

- La aplicación redirige automáticamente a `/cambra`.
- El flujo CAMBRA se carga mediante **lazy loading**.
- Existe una página principal `CambraPage` que actúa como **orquestador del flujo completo**.

---

## Modelos implementados (`core/models`)

- `age-group.model.ts`
  - Define los grupos etarios: `AGE_0_5 | AGE_6_PLUS`

- `patient.model.ts`
  - Información básica del paciente (edad, grupo etario)

- `cambra-item.model.ts`
  - Define un ítem del cuestionario CAMBRA

- `cambra-form.model.ts`
  - Define la estructura del formulario CAMBRA

- `cambra-result.model.ts`
  - Define el resultado del cálculo CAMBRA:
    - puntajes parciales
    - puntaje total
    - nivel de riesgo

---

## Servicios implementados (`core/services`)

### `cambra-state.service.ts`

Servicio de **estado global** de la aplicación.

Responsabilidades:
- Determinar el grupo etario a partir de la edad.
- Almacenar el resultado CAMBRA actual.
- Permitir que múltiples componentes consuman el mismo estado.
- Reiniciar el flujo completo si es necesario.

Este servicio evita:
- duplicar lógica,
- recalcular resultados,
- dependencias directas entre componentes.

---

### `cambra-calculation.service.ts`

Servicio puramente clínico.

Responsabilidades:
- Implementar **toda la lógica de cálculo CAMBRA ≥6**.
- Calcular:
  - Indicadores de enfermedad (+2)
  - Factores de riesgo (+1)
  - Factores protectores (−1)
  - Puntaje total
  - Riesgo global (Bajo / Alto)

No depende de:
- UI
- formularios
- componentes

Funciona como **motor clínico** del sistema.

---

## Definición clínica CAMBRA ≥6 años

- `features/cambra/cambra-6plus.definition.ts`

Contiene los **ítems reales del cuestionario CAMBRA ≥6**, separados en:
- Indicadores de enfermedad
- Factores de riesgo
- Factores protectores

Funciona como **fuente única de verdad clínica**, desacoplada del formulario.

---

## Componentes implementados (estado actual)

Todos los componentes son **standalone** y **sin estilos**.

### Página principal

- `CambraPage`
  - Controla el flujo general
  - Decide qué formulario mostrar según el grupo etario
  - Renderiza:
    - formulario
    - resumen de puntaje
    - riesgo resultante

---

### Componentes funcionales

#### `PatientInfo`
- Paso inicial obligatorio
- Solicita la edad del paciente
- Define el grupo etario usando `CambraStateService`

---

#### `CambraForm`
- Implementado con **Reactive Forms**
- Renderiza el cuestionario CAMBRA ≥6
- Usa `FormArray` para:
  - Indicadores de enfermedad
  - Factores de riesgo
  - Factores protectores
- Recalcula automáticamente el resultado al cambiar el formulario
- Guarda el resultado en el estado global

---

#### `ScoreSummary`
- Consume el resultado desde `CambraStateService`
- Muestra:
  - puntaje por categoría
  - puntaje total
- No realiza cálculos

---

#### `RiskResult`
- Consume el resultado desde `CambraStateService`
- Muestra el **riesgo global de caries**
- Totalmente desacoplado del formulario

---

#### `Recommendations`
- Componente creado
- Aún no conectado a la lógica

---

#### `FollowUp`
- Componente creado
- Aún no conectado a la lógica

---

## Estado actual del proyecto

✅ Proyecto Angular creado y configurado  
✅ SPA clásica (sin SSR ni zoneless)  
✅ Routing principal y lazy loading CAMBRA  
✅ Estructura de carpetas definida  
✅ Flujo etario implementado (edad → formulario)  
✅ Estado global de aplicación implementado  
✅ Reactive Forms implementados  
✅ Ítems CAMBRA ≥6 definidos  
✅ Servicio de cálculo CAMBRA implementado  
✅ Recalculo automático en cada cambio  
✅ Resumen de puntaje visible  
✅ Riesgo global visible  

---

## Próximos pasos pendientes

### Lógica clínica
- Implementar la **regla especial CAMBRA**:
  - Puntaje 0–4 + prueba bacteriana positiva ⇒ Riesgo Alto

### Funcionalidad pendiente
- Conectar `Recommendations` según riesgo
- Conectar `FollowUp` según riesgo
- Implementar formulario **CAMBRA 0–5 años**

### UI / UX (más adelante)
- Diseño visual clínico
- Checkboxes claros
- Tooltips para factores que requieren pruebas
- Indicadores visuales de riesgo

### Mejoras futuras
- Exportar evaluación a PDF
- Guardado local (localStorage)
- Comparación entre evaluaciones
- Internacionalización
- Persistencia backend

---

## Nota final

El proyecto se está construyendo **desde el flujo clínico correcto hacia la implementación técnica**, priorizando corrección, claridad y mantenibilidad.

La arquitectura actual permite:
- extender reglas clínicas sin tocar UI,
- agregar nuevos grupos etarios,
- escalar a backend sin refactors mayores.
