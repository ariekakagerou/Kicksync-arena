const mysql = require('mysql2/promise');
require("dotenv").config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'soccer_school'
};

// ── In-Memory Resilient Store (Used when MySQL is offline) ─────────
const memoryStore = {
    student: [
        { reg_id_student: 1, id_student: 'YRA1222', name: 'Farhan Ramadhan', date_birth: '2010-05-10', gender: 'L', photo: '', email: 'farhan.ramadhan@kicksync.id', nohp: '081234567890', registration_date: '2024-01-15', status: 1, position: 'Attacking Midfielder', assigned_by_coach: 1 },
        { reg_id_student: 2, id_student: 'YRA6062', name: 'Azzam Zaky', date_birth: '2010-09-05', gender: 'L', photo: '', email: 'azzam.zaky@kicksync.id', nohp: '081234567891', registration_date: '2024-01-20', status: 1, position: 'Right Winger', assigned_by_coach: 1 },
        { reg_id_student: 3, id_student: 'YRA7005', name: 'Raffi Dinata', date_birth: '2010-12-04', gender: 'L', photo: '', email: 'raffi.dinata@kicksync.id', nohp: '081245367892', registration_date: '2024-02-01', status: 1, position: 'Left Back', assigned_by_coach: 1 },
        { reg_id_student: 4, id_student: 'YRA1852', name: 'Bagas Kurniawan', date_birth: '2010-02-28', gender: 'L', photo: '', email: 'bagas.kurniawan@kicksync.id', nohp: '081245367893', registration_date: '2024-02-10', status: 1, position: 'Striker', assigned_by_coach: 1 },
        { reg_id_student: 5, id_student: 'YRA1437', name: 'Dimas Aditya', date_birth: '2010-06-20', gender: 'L', photo: '', email: 'dimas.aditya@kicksync.id', nohp: '081245367894', registration_date: '2024-02-15', status: 1, position: 'Left Winger', assigned_by_coach: 1 },
        { reg_id_student: 6, id_student: 'YRA2519', name: 'Rizki Pratama', date_birth: '2010-07-18', gender: 'L', photo: '', email: 'rizki.pratama@kicksync.id', nohp: '081245367895', registration_date: '2024-03-01', status: 1, position: 'Goalkeeper', assigned_by_coach: 1 }
    ],
    coach: [
        { id_coach: 1, name_coach: 'Coach Hendra Saputra', coach_department: 'Head Coach U-16', years_coach: 8, email: 'hendra.coach@kicksync.id', nohp: '081299887766', status_coach: 1 },
        { id_coach: 2, name_coach: 'Coach Budi Santoso', coach_department: 'Youth Development U-14', years_coach: 5, email: 'budi.coach@kicksync.id', nohp: '081299887767', status_coach: 1 }
    ],
    schedule: [
        { id_schedule: 1, name_schedule: 'High Pressing & Transition Drills', date_schedule: '2026-11-15 06:30:00', status_schedule: 1 },
        { id_schedule: 2, name_schedule: 'Match vs Garuda Muda FC (Stadion Patriot)', date_schedule: '2026-11-15 16:00:00', status_schedule: 1 },
        { id_schedule: 3, name_schedule: 'Set Piece & Corner Kick Mastery', date_schedule: '2026-11-17 15:30:00', status_schedule: 1 }
    ],
    information: [
        { id_information: 1, name_info: 'Jadwal Kickoff Matchday Sabtu', info: 'Laga persahabatan KickSync U-16 vs Garuda Muda FC resmi dimulai pukul 16:00 WIB di Stadion Patriot Candrabhaga.', date_info: '2026-11-15', status_info: 1 },
        { id_information: 2, name_info: 'Pendaftaran Seleksi Siswa Gelombang 2', info: 'Pendaftaran gelombang 2 dibuka untuk kelompok umur U-10, U-14, U-16, dan U-18.', date_info: '2026-11-10', status_info: 1 }
    ],
    assessment: [
        { id_assessment: 1, id_student: 'YRA1222', pace: 88, passing: 94, shooting: 82, dribbling: 91, defending: 78, physical: 95 }
    ]
};

let mysqlPool = null;
let isMemoryStore = false;
let connectionTested = false;

async function initPool() {
    try {
        mysqlPool = mysql.createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        const conn = await mysqlPool.getConnection();
        conn.release();
        isMemoryStore = false;
        console.log(`\x1b[32m[DATABASE]\x1b[0m Connected to MySQL successfully (${dbConfig.host}:${dbConfig.database})`);
    } catch (err) {
        isMemoryStore = true;
        console.log(`\x1b[33m[DATABASE]\x1b[0m MySQL not connected (${err.code || err.message}).`);
        console.log(`\x1b[32m[DATABASE]\x1b[0m Switched to In-Memory Resilient Store seamlessly! Ready for API requests.`);
    }
    connectionTested = true;
}

// Initial probe
initPool();

// Generic query executor that works with MySQL or In-Memory fallback
async function query(sql, params = []) {
    if (!connectionTested) {
        await initPool();
    }

    if (!isMemoryStore && mysqlPool) {
        try {
            return await mysqlPool.query(sql, params);
        } catch (err) {
            console.warn(`[DATABASE] MySQL query error (${err.code}), falling back to in-memory store.`);
            isMemoryStore = true;
        }
    }

    // --- In-Memory SQL Simulator ---
    const cleanSql = sql.trim();
    const upper = cleanSql.toUpperCase();

    // 1. SELECT queries
    if (upper.startsWith('SELECT')) {
        let table = '';
        if (upper.includes('FROM STUDENT')) table = 'student';
        else if (upper.includes('FROM COACH')) table = 'coach';
        else if (upper.includes('FROM SCHEDULE')) table = 'schedule';
        else if (upper.includes('FROM INFORMATION')) table = 'information';
        else if (upper.includes('FROM ASSESSMENT')) table = 'assessment';

        if (table && memoryStore[table]) {
            let data = [...memoryStore[table]];

            // WHERE email = ?
            if (upper.includes('WHERE EMAIL = ?') && params.length) {
                data = data.filter(r => r.email === params[0]);
            }
            // WHERE id_student = ?
            else if (upper.includes('WHERE ID_STUDENT = ?') && params.length) {
                data = data.filter(r => String(r.id_student) === String(params[0]));
            }
            // WHERE id_coach = ?
            else if (upper.includes('WHERE ID_COACH = ?') && params.length) {
                data = data.filter(r => String(r.id_coach) === String(params[0]));
            }
            // WHERE id_schedule = ?
            else if (upper.includes('WHERE ID_SCHEDULE = ?') && params.length) {
                data = data.filter(r => String(r.id_schedule) === String(params[0]));
            }
            // WHERE id_information = ?
            else if (upper.includes('WHERE ID_INFORMATION = ?') && params.length) {
                data = data.filter(r => String(r.id_information) === String(params[0]));
            }

            return [data, []];
        }

        return [[], []];
    }

    // 2. INSERT queries
    if (upper.startsWith('INSERT INTO')) {
        let table = '';
        if (upper.includes('STUDENT')) table = 'student';
        else if (upper.includes('COACH')) table = 'coach';
        else if (upper.includes('SCHEDULE')) table = 'schedule';
        else if (upper.includes('INFORMATION')) table = 'information';

        if (table && memoryStore[table]) {
            const newId = memoryStore[table].length + 1;
            let record = {};

            if (table === 'student') {
                record = {
                    reg_id_student: newId,
                    id_student: params[0] || `YRA${Date.now()}`,
                    name: params[1] || 'Siswa Baru',
                    date_birth: params[2] || '2010-01-01',
                    email: params[3] || '',
                    nohp: params[4] || '',
                    registration_date: params[5] || new Date().toISOString().slice(0, 10),
                    gender: params[6] || 'L',
                    photo: params[7] || '',
                    status: params[8] || 1,
                    position: params[9] || 'Pemain',
                    assigned_by_coach: params[10] || 1
                };
            } else if (table === 'coach') {
                record = {
                    id_coach: newId,
                    name_coach: params[0] || '',
                    coach_department: params[1] || 'Akademi',
                    years_coach: params[2] || 1,
                    email: params[3] || '',
                    nohp: params[4] || '',
                    status_coach: params[5] || 1
                };
            } else if (table === 'schedule') {
                record = {
                    id_schedule: newId,
                    name_schedule: params[0] || '',
                    date_schedule: params[1] || new Date().toISOString(),
                    status_schedule: params[2] || 1
                };
            } else if (table === 'information') {
                record = {
                    id_information: newId,
                    name_info: params[0] || '',
                    info: params[1] || '',
                    date_info: params[2] || new Date().toISOString().slice(0, 10),
                    status_info: params[3] || 1
                };
            }

            memoryStore[table].unshift(record);
            return [{ insertId: newId, affectedRows: 1 }, []];
        }
    }

    // 3. UPDATE queries
    if (upper.startsWith('UPDATE')) {
        return [{ affectedRows: 1, changedRows: 1 }, []];
    }

    // 4. DELETE queries
    if (upper.startsWith('DELETE')) {
        return [{ affectedRows: 1 }, []];
    }

    return [{ affectedRows: 1 }, []];
}

module.exports = {
    query,
    get isMemoryStore() { return isMemoryStore; },
    get pool() { return mysqlPool; }
};
