/* ============================================================
   YouthTrigger Arena — Unified Backend API Client
   Connects to Youth-Tiger-Soccer-School-back-end- (Port 3000)
   File: js/api.js
   ============================================================ */

const API = (() => {
  let _baseUrl = 'http://localhost:3000/api';
  let _isOnline = false;
  let _healthData = null;
  const _listeners = [];

  // Register listener for backend status changes
  function onStatusChange(fn) {
    _listeners.push(fn);
  }

  function notifyStatus(online, data = null) {
    _isOnline = online;
    _healthData = data;
    _listeners.forEach(fn => fn(online, data));
  }

  // Probe backend health check
  async function checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const res = await fetch(`${_baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        notifyStatus(true, data);
        return { online: true, data };
      }
    } catch (_err) {
      // Backend not running
    }
    notifyStatus(false, null);
    return { online: false, data: null };
  }

  // Auto-check on boot and periodic ping every 10 seconds
  checkHealth();
  setInterval(checkHealth, 10000);

  // Helper fetch with timeout and fallback
  async function apiFetch(endpoint, options = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${_baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        signal: controller.signal,
        ...options
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        _isOnline = true;
        return await res.json();
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn(`[API FETCH FAILED] ${endpoint}:`, err.message);
      throw err;
    }
  }

  // ── 1. Students / Siswa API ────────────────────────────────
  async function getStudents() {
    try {
      return await apiFetch('/student');
    } catch (_err) {
      // Fallback to local SQUAD_ROSTER
      return SQUAD_ROSTER.map((p, idx) => ({
        reg_id_student: idx + 1,
        id_student: `YRA${p.number * 100}`,
        name: p.name,
        date_birth: '2010-05-10',
        gender: 'L',
        email: `${p.name.toLowerCase().replace(' ', '.')}@youthtrigger.id`,
        nohp: '081234567890',
        registration_date: '2024-01-15',
        status: p.status === 'active' ? 1 : 0,
        position: p.pos,
        fitness: p.fitness,
        attendance: p.attendance
      }));
    }
  }

  async function createStudent(studentData) {
    try {
      return await apiFetch('/student', {
        method: 'POST',
        body: JSON.stringify(studentData)
      });
    } catch (err) {
      console.warn('[API fallback: createStudent local]');
      const localId = `YRA${Math.floor(Math.random() * 1000000)}`;
      return {
        id_student: localId,
        ...studentData,
        status: 1,
        _offlineSaved: true
      };
    }
  }

  // ── 2. Coaches / Pelatih API ──────────────────────────────
  async function getCoaches() {
    try {
      return await apiFetch('/coach');
    } catch (_err) {
      return [
        { id_coach: 1, name_coach: 'Coach Hendra Saputra', coach_department: 'Head Coach U-16', years_coach: 8, email: 'hendra.coach@youthtrigger.id', nohp: '081299887766', status_coach: 1 },
        { id_coach: 2, name_coach: 'Coach Budi Santoso', coach_department: 'Youth Development U-14', years_coach: 5, email: 'budi.coach@youthtrigger.id', nohp: '081299887767', status_coach: 1 }
      ];
    }
  }

  // ── 3. Schedule / Sesi Latihan & Match API ────────────────
  async function getSchedules() {
    try {
      return await apiFetch('/schedule');
    } catch (_err) {
      return TRAINING_SESSIONS.map((s, idx) => ({
        id_schedule: idx + 1,
        name_schedule: `${s.title} (${s.location})`,
        date_schedule: s.time,
        status_schedule: s.status === 'active' ? 1 : 0
      }));
    }
  }

  async function createSchedule(scheduleData) {
    try {
      return await apiFetch('/schedule', {
        method: 'POST',
        body: JSON.stringify(scheduleData)
      });
    } catch (_err) {
      return {
        id_schedule: Date.now(),
        ...scheduleData,
        _offlineSaved: true
      };
    }
  }

  // ── 4. Information / Pengumuman API ───────────────────────
  async function getInformation() {
    try {
      return await apiFetch('/information');
    } catch (_err) {
      return ACADEMY_NEWS.map((n, idx) => ({
        id_information: idx + 1,
        name_info: n.title,
        info: n.desc,
        date_info: n.date,
        status_info: 1
      }));
    }
  }

  async function createInformation(infoData) {
    try {
      return await apiFetch('/information', {
        method: 'POST',
        body: JSON.stringify(infoData)
      });
    } catch (_err) {
      return {
        id_information: Date.now(),
        ...infoData,
        _offlineSaved: true
      };
    }
  }

  return {
    get isOnline() { return _isOnline; },
    get healthData() { return _healthData; },
    get baseUrl() { return _baseUrl; },
    setBaseUrl(url) { _baseUrl = url; checkHealth(); },
    checkHealth,
    onStatusChange,
    getStudents,
    createStudent,
    getCoaches,
    getSchedules,
    createSchedule,
    getInformation,
    createInformation
  };
})();
