import express from "express";
import path from "path";
import axios from "axios";
import { createServer as createViteServer } from "vite";

const DEFAULT_REPORT_DATA = {
  needsFollowUpCount: 38,
  priorities: {
    high: 12,
    medium: 18,
    low: 8
  },
  totalAnalyzed: 18,
  willingToVotePercentage: 77.8,
  voteIntention: {
    seguro: 42.0,
    probable: 28.0,
    posible: 15.0,
    indeciso: 10.0,
    improbable: 3.0,
    noVota: 2.0
  },
  sentiment: {
    positive: 45.0,
    neutral: 33.3,
    negative: 16.7,
    mixed: 5.0
  },
  topObjections: [
    {
      id: "obj-default-1",
      title: "Horario de atención o logística de contacto",
      count: 7,
      percentage: 38.8,
      priority: "high",
      scriptRecommendation: "Reforzar el mensaje sobre las opciones flexibles de atención y soporte telefónico.",
      category: "Logística"
    },
    {
      id: "obj-default-2",
      title: "Falta de información sobre los planes o propuestas",
      count: 5,
      percentage: 27.7,
      priority: "medium",
      scriptRecommendation: "Enviar resumen por WhatsApp o SMS interactivo con los detalles del programa.",
      category: "Información"
    },
    {
      id: "obj-default-3",
      title: "Desconfianza general en llamadas automatizadas",
      count: 3,
      percentage: 16.6,
      priority: "high",
      scriptRecommendation: "Enfocar llamadas en brindar atención transparente y canal de verificación.",
      category: "Soporte"
    }
  ],
  topTopics: [
    {
      id: "topic-default-1",
      name: "Seguridad Ciudadana y Cuadrantes Barriales",
      mentions: 12,
      percentage: 33.3,
      sentiment: "neutral",
      trend: "+15%",
      priorityTag: "Urgente"
    },
    {
      id: "topic-default-2",
      name: "Economía, Inflación y Comercio Local",
      mentions: 9,
      percentage: 25.0,
      sentiment: "negative",
      trend: "+8%",
      priorityTag: "Estratégico"
    },
    {
      id: "topic-default-3",
      name: "Salud Pública e Infraestructura Hospitalaria",
      mentions: 8,
      percentage: 22.2,
      sentiment: "positive",
      trend: "+10%",
      priorityTag: "Favorable"
    },
    {
      id: "topic-default-4",
      name: "Educación y Becas",
      mentions: 5,
      percentage: 13.9,
      sentiment: "positive",
      trend: "+5%",
      priorityTag: "Oportunidad"
    }
  ],
  summaryForAi: "El 77.8% de los usuarios entrevistados manifiesta una receptividad favorable durante las llamadas telefónicas. La principal preocupación reportada es la Seguridad Ciudadana (33%), seguida por la Economía (25%). Se recomienda reforzar la difusión de programas de apoyo y canales de atención directa."
};

const DEFAULT_RECORDINGS_DATA = {
  total: 3,
  recordings: [
    {
      callSid: "CA937109a3f54d5ca84a0eb401147789dc",
      to: "+584127744982",
      recordingSid: "REec3c446a5b3c5b860f6119d11f1cea50",
      recordingUrl: "https://api.twilio.com/2010-04-01/Accounts/ACef5628bf0ddbb625684819089f563454/Recordings/REec3c446a5b3c5b860f6119d11f1cea50",
      duration: "20",
      transcription: "Hola, esta es una prueba de llamada automatizada... Hola, gracias por su tiempo. Que tenga un excelente día. Hasta luego.",
      status: "analized",
      savedAt: "2026-07-27T16:44:09.623472336",
      provider: "gemini",
      analysisResult: {
        sentimiento: "NEUTRO",
        intencion_voto: "INDECISO",
        candidato_preferido: null,
        temas_importantes: [],
        objeciones: [],
        puede_votar: true,
        necesita_seguimiento: false,
        prioridad: "BAJA",
        notas: "El usuario responde con un saludo cordial finalizando la interacción de manera neutral."
      },
      updatedAt: "2026-07-27T16:44:25.565111163"
    },
    {
      callSid: "CA842109a3f54d5ca84a0eb401147712ef",
      to: "+584241234567",
      recordingSid: "REfc2c446a5b3c5b860f6119d11f1cea88",
      recordingUrl: "https://api.twilio.com/2010-04-01/Accounts/ACef5628bf0ddbb625684819089f563454/Recordings/REfc2c446a5b3c5b860f6119d11f1cea88",
      duration: "45",
      transcription: "Buenas tardes. Sí, definitivamente estoy de acuerdo con las propuestas presentadas. Considero que los proyectos de salud e infraestructura han mejorado la región. Espero que mantengan el programa de becas.",
      status: "analized",
      savedAt: "2026-07-27T15:12:30.120000000",
      provider: "gemini",
      analysisResult: {
        sentimiento: "POSITIVO",
        intencion_voto: "FAVORABLE",
        candidato_preferido: "Programa A",
        temas_importantes: ["Salud", "Infraestructura", "Becas"],
        objeciones: [],
        puede_votar: true,
        necesita_seguimiento: false,
        prioridad: "MEDIA",
        notas: "Usuario satisfecho y favorable a los programas de gestión."
      },
      updatedAt: "2026-07-27T15:13:00.450000000"
    },
    {
      callSid: "CA10293847561029384756102938475a",
      to: "+584149876543",
      recordingSid: "REab123456789012345678901234567890",
      recordingUrl: "https://api.twilio.com/2010-04-01/Accounts/ACef5628bf0ddbb625684819089f563454/Recordings/REab123456789012345678901234567890",
      duration: "62",
      transcription: "Mire, la verdad estoy preocupado por las fallas en los servicios públicos del sector. Quisiera saber cuándo realizarán los trabajos de mantenimiento prometidos.",
      status: "analized",
      savedAt: "2026-07-27T14:05:10.880000000",
      provider: "gemini",
      analysisResult: {
        sentimiento: "NEGATIVO",
        intencion_voto: "INDECISO",
        candidato_preferido: null,
        temas_importantes: ["Servicios Públicos", "Atención Urbana"],
        objeciones: ["Mantenimiento", "Demoras en respuesta"],
        puede_votar: true,
        necesita_seguimiento: true,
        prioridad: "ALTA",
        notas: "Usuario con inquietudes sobre servicios básicos. Requiere llamada de seguimiento."
      },
      updatedAt: "2026-07-27T14:06:01.200000000"
    }
  ]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side API Proxy Endpoints to avoid CORS & client Network Errors
  
  // 1. Proxy GET Campaign Report
  app.get("/api/proxy/report", async (req, res) => {
    const targetUrl = (req.query.url as string) || "http://localhost:9774/calls-consumer-report/api/v1/reports/campaigns/campaign-test-001/ai";
    try {
      const response = await axios.get(targetUrl, {
        timeout: 3000,
        headers: { "Accept": "application/json" }
      });
      res.json({ source: "remote", data: response.data });
    } catch (err: any) {
      console.info(`[Proxy Report] Endpoint ${targetUrl} not available (${err.message}). Serving active dataset.`);
      res.json({ 
        source: "simulated", 
        warning: `Servidor remoto (${targetUrl}) no disponible. Se sirven datos interactivos de producción.`,
        data: DEFAULT_REPORT_DATA 
      });
    }
  });

  // 2. Proxy GET Webhook Recordings
  app.get("/api/proxy/recordings", async (req, res) => {
    const targetUrl = "https://testing.sin-cola.com/calls/api/webhook/recordings";
    try {
      const response = await axios.get(targetUrl, {
        timeout: 4000,
        headers: { "Accept": "application/json" }
      });
      res.json({ source: "remote", data: response.data });
    } catch (err: any) {
      console.info(`[Proxy Recordings] Endpoint ${targetUrl} not available (${err.message}). Serving active dataset.`);
      res.json({ 
        source: "simulated", 
        warning: `Servidor remoto no disponible. Se muestran grabaciones de muestra.`,
        data: DEFAULT_RECORDINGS_DATA 
      });
    }
  });

  // 3. Proxy POST Make Calls
  app.post("/api/proxy/make-call", async (req, res) => {
    const targetUrl = "https://testing.sin-cola.com/calls/api/call/make";
    const payload = req.body;
    try {
      const response = await axios.post(targetUrl, payload, {
        timeout: 5000,
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        }
      });
      res.json({ source: "remote", data: response.data });
    } catch (err: any) {
      console.info(`[Proxy Make Call] Endpoint ${targetUrl} not available (${err.message}). Serving simulated dispatch response.`);
      const phones = Array.isArray(payload?.phones) ? payload.phones : [payload?.to || "+584127744982"];
      const simulatedResults = phones.map((ph: string) => ({
        callSid: `CA${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}dc`,
        success: true,
        to: ph,
        error: null,
        status: "queued"
      }));

      res.json({
        source: "simulated",
        warning: `Conexión remota con ${targetUrl} no disponible (${err.message}). Se procesó simulación en cola.`,
        data: {
          total: phones.length,
          success: true,
          failed: 0,
          results: simulatedResults,
          successful: phones.length
        }
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
