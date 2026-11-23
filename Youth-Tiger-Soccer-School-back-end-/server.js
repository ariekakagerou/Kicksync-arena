const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const db = require('./config/db');
require('dotenv').config();

const app = express();

// Pastikan folder uploads/image tersedia
const uploadDir = path.join(__dirname, 'uploads', 'image');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Healthcheck & API Info ──────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'online',
        app: 'KickSync Arena & Youth Tiger Soccer School API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        database: {
            mode: db.isMemoryStore ? 'in-memory-fallback' : 'mysql',
            connected: true
        },
        endpoints: {
            student: '/api/student',
            coach: '/api/coach',
            schedule: '/api/schedule',
            information: '/api/information',
            assessment: '/api/assessment',
            docs: '/api-docs'
        }
    });
});

// ── Swagger UI ───────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'KickSync & Youth Tiger Soccer School API Docs',
    customCss: '.swagger-ui .topbar { background-color: #09090b; } .swagger-ui .topbar .download-url-wrapper { display: none; }',
    swaggerOptions: { persistAuthorization: true },
}));

// Redirect root ke Swagger UI
app.get('/', (_req, res) => {
    res.redirect('/api-docs');
});

// Mengimpor rute
const studentRoutes = require('./student/routes/studentsRoutes');
const assessmentSetRoutes = require('./assessment_setting/routes/assessmentSetRoutes');
const assessmentRoutes = require('./assessment/routes/assessmentRoutes');
const managementRoutes = require('./management/routes/managementRoutes');
const aspectRoutes = require('./aspect/routes/aspectRoutes');
const aspectSubRoutes = require('./aspect_sub/routes/aspectsubRoutes');
const informationRoutes = require('./information/routes/informationRoutes');
const scheduleRoutes = require('./schedule/routes/sheduleRoutes');
const poinrateRoutes = require('./point_rate/routes/pointrateRoutes');
const departementRoutes = require('./departement/routes/departementRoutes');
const coachRoutes = require('./coach/routes/coachRoutes');

// Menghubungkan rute
app.use('/api/student', studentRoutes);
app.use('/api/assessment_setting', assessmentSetRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/management', managementRoutes);
app.use('/api/aspect', aspectRoutes);
app.use('/api/aspect_sub', aspectSubRoutes);
app.use('/api/information', informationRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/poinrate', poinrateRoutes);
app.use('/api/departement', departementRoutes);
app.use('/api/coach', coachRoutes);

// Middleware untuk menangani error
app.use((err, _req, res, _next) => {
    console.error('[SERVER ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Menentukan port
const PORT = process.env.PORT || 3000;

// Menjalankan server
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n============================================================');
    console.log('⚽ \x1b[32mKickSync Arena & Youth Tiger Soccer School API\x1b[0m');
    console.log(`🚀 Server running on \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`📖 Swagger API Docs: \x1b[36mhttp://localhost:${PORT}/api-docs\x1b[0m`);
    console.log(`💓 Health Check:     \x1b[36mhttp://localhost:${PORT}/api/health\x1b[0m`);
    console.log('============================================================\n');
});
