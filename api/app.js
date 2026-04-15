const express = require('express');
const cors    = require('cors');
const app     = express();

// ── Middlewares globales ───────────────────────────────────────────────
const corsOptions = {
  origin: [
    'http://localhost:5173',      // Vite dev
    'http://localhost:5175',      // Por si acaso
    'https://namnam.devpaulvelasco.com', // Tu frontend en producción (cámbialo)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ← Importante: maneja el preflight
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ── Rutas ──────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./src/routes/authRouter'));
app.use('/api/categorias',   require('./src/routes/categoriaRouter'));
app.use('/api/usuarios',     require('./src/routes/usuarioRouter'));
app.use('/api/recetas',      require('./src/routes/recetaRouter'));
app.use('/api/favoritos',    require('./src/routes/favoritoRouter'));
app.use('/api/valoraciones', require('./src/routes/valoracionRouter'));
app.use('/api/comentarios',  require('./src/routes/comentarioRouter'));
app.use('/api/configuracion', require('./src/routes/configuracionGlobalRouter'));

// ── Ruta de salud (health check) ───────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ── Middleware de errores global ───────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    ok:      false,
    mensaje: err.message || 'Error interno del servidor',
  });
});

module.exports = app;