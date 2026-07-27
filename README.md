# Llamadas Automatizadas IA - Plataforma de Inteligencia de Voz

Este proyecto es una plataforma interactiva de producción para el monitoreo, emisión y análisis en tiempo real de llamadas telefónicas automatizadas con IA. Está construido con **Vue 3**, **Vite**, **Tailwind CSS**, y un servidor de respaldo en **Express (Node.js)** con proxy para evitar problemas de CORS y tolerancia a fallos.

---

## 📋 Requisitos de Entorno y Versiones

Para ejecutar y construir este proyecto sin inconvenientes, asegúrate de contar con los siguientes entornos:

- **Node.js**: **Versión 18.x, 20.x o 22.x LTS** (Recomendado: **Node.js 20 LTS** o superior).
  - *Nota*: La aplicación utiliza características de ESM y empaquetado TypeScript nativo que requieren al menos Node v18.0.0.
- **npm**: **Versión 9.x o 10.x** (incluido por defecto con las instalaciones recientes de Node.js).

### Verificar versiones instaladas en tu máquina

Abre tu terminal y ejecuta:

```bash
node -v
# Ejemplo de salida esperada: v20.11.0 o v18.19.0

npm -v
# Ejemplo de salida esperada: 10.2.4
```

> **¿Tienes una versión antigua de Node?**
> Si usas [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager), puedes instalar y seleccionar la versión adecuada con:
> ```bash
> nvm install 20
> nvm use 20
> ```

---

## 🚀 Guía de Configuración Local

### 1. Instalación de Dependencias

Abre la terminal en la raíz del proyecto y ejecuta:

```bash
npm install
```

### 2. Variables de Entorno (Opcional)

Puedes basarte en el archivo `.env.example` para declarar variables específicas si las necesitas:

```bash
cp .env.example .env
```

### 3. Iniciar Servidor de Desarrollo Local

Para ejecutar el entorno de desarrollo integrado (servidor Express + Vite HMR):

```bash
npm run dev
```

El servidor iniciará en:
👉 **http://localhost:3000** (o el puerto configurado).

El archivo `server.ts` actúa como servidor principal y proxy local, lo que permite que las peticiones a endpoints externos como `https://testing.sin-cola.com` funcionen sin bloqueos por CORS en el navegador.

---

## 🏭 Configuración para Producción

Para desplegar esta aplicación en un servidor de producción (como Cloud Run, Docker, VPS, Render o Railway):

### 1. Compilación del Proyecto

Ejecuta el comando de build:

```bash
npm run build
```

Este comando realiza dos acciones automáticas:
1. Compila la interfaz cliente de Vue 3 a archivos estáticos optimizados en `/dist`.
2. Empaqueta el servidor de TypeScript `server.ts` utilizando `esbuild` en un archivo ejecutable único: `dist/server.cjs`.

### 2. Iniciar en Producción

Para arrancar el servidor empaquetado en producción:

```bash
npm run start
```

El servidor servirá tanto las API proxy (`/api/proxy/*`) como la aplicación SPA compilada.

---

## 🛠️ Estructura del Proyecto

```text
├── server.ts                       # Servidor Express & Proxy API para evitar CORS y proveer fallbacks
├── package.json                    # Scripts y dependencias del proyecto
├── vite.config.ts                  # Configuración de Vite & Tailwind CSS
├── src/
│   ├── main.js                     # Punto de entrada principal de Vue 3
│   ├── App.vue                     # Componente raíz y navegación por pestañas
│   ├── index.css                   # Estilos globales y efectos cibernéticos (glassmorphism)
│   ├── components/
│   │   ├── SidebarNav.vue          # Barra de navegación lateral colapsable
│   │   ├── KpiMetrics.vue          # Tarjetas de métricas clave (KPIs)
│   │   ├── AiExecutiveSummary.vue  # Banner con resumen ejecutivo generado por IA
│   │   ├── VoteIntentionChart.vue  # Gráfico de barras de intención de voto
│   │   ├── SentimentChart.vue      # Gráfico de dona de sentimiento tonal
│   │   ├── TopObjections.vue       # Ranking de objeciones encontradas
│   │   ├── TopTopics.vue           # Ranking de temas de interés
│   │   ├── RecentCallsStream.vue   # Monitoreo y reproductor de audio simulado
│   │   ├── MakeCallsPanel.vue      # Panel POST para lanzar llamadas (testing.sin-cola.com)
│   │   ├── RecordingsPanel.vue     # Detalle GET de grabaciones, transcripciones y análisis Gemini
│   │   └── ApiConnectionPanel.vue  # Consola de prueba para servidor local (localhost:9774)
│   └── data/
│       └── initialData.js          # Datos iniciales y estructuras de demostración
```

---

## 🔌 Integraciones, Polling y Endpoints Integrados

Esta plataforma cuenta con **Refresco Automático (Polling) Configurable** en tiempo real tanto para la vista del Dashboard General como para la auditoría de Grabaciones:

- **Polling Configurable**:
  - Puedes activar o desactivar la consulta automática (**Polling ON / OFF**).
  - Selecciona la frecuencia de refresco desde la interfaz (intervalos configurables de **5s, 10s, 15s, 30s o 60s**).
  - Incluye un contador en vivo con temporizador regresivo (`5s... 4s... 3s...`) e indicador de estado en línea.

### Endpoints Conectados:

1. **Grabaciones y Análisis en Tiempo Real (GET)**:
   - Endpoint: `https://testing.sin-cola.com/calls/api/webhook/recordings`
   - Vista en App: Pestaña **Detalle de Grabaciones**.
   - Incluye URL editable en vivo, Polling automático configurable y auditoría de audios, transcripciones completas y clasificación generativa con Gemini.

2. **Lanzador de Llamadas Salientes (POST)**:
   - Endpoint: `https://testing.sin-cola.com/calls/api/call/make`
   - Vista en App: Pestaña **Generar Llamadas**.
   - Permite enviar lotes de números telefónicos y seleccionar plantillas de encuestas.

3. **Reporte de Campaña Consolidadas (GET)**:
   - Endpoint por defecto: `http://localhost:9774/calls-consumer-report/api/v1/reports/campaigns/campaign-test-001/ai`
   - Vista en App: **Dashboard General** y Pestaña **Servicio API Local**.
   - Cuenta con botón de sincronización directa y Polling automático configurable en la barra superior.

---

## 🔮 Cómo seguir agregando nuevas funcionalidades a futuro

Si exportas este proyecto a un repositorio de **GitHub** o como código fuente ZIP y deseas seguir añadiendo módulos:

1. **Para agregar una nueva pantalla/pestaña**:
   - Crea un nuevo componente `.vue` en `src/components/` (ej: `src/components/NewFeature.vue`).
   - Registra el nuevo ícono e ID de pestaña en `src/components/SidebarNav.vue` en el arreglo `navItems`.
   - Agrega la pestaña en `src/App.vue` dentro de la sección de `tabTitles` y en la plantilla con `<Transition>`.

2. **Para conectar nuevos servicios backend**:
   - Agrega la ruta Proxy correspondientes en `server.ts` bajo la sección `// Server-side API Proxy Endpoints`.
   - Utiliza `axios` dentro de tus componentes de Vue para consumir la ruta del proxy (`/api/proxy/tu-nueva-ruta`).

3. **Control de Versiones con Git**:
   - Guarda tus cambios: `git add . && git commit -m "feat: nueva funcionalidad"`
   - Sube los cambios a tu repositorio: `git push origin main`
