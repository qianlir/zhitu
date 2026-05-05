// API client — talks to FastAPI backend at /api/*
const API = {
  async get(path) {
    const r = await fetch('/api' + path);
    if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + path);
    return r.json();
  },
  async post(path, body) {
    const r = await fetch('/api' + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + path);
    return r.json();
  },

  // Endpoints
  districts: () => API.get('/meta/districts'),
  types: () => API.get('/meta/types'),
  stats: () => API.get('/meta/stats'),
  schools: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (Array.isArray(v)) v.length && qs.set(k, v.join(','));
      else if (v !== '' && v != null) qs.set(k, v);
    });
    const s = qs.toString();
    return API.get('/schools' + (s ? '?' + s : ''));
  },
  school: (id) => API.get('/schools/' + encodeURIComponent(id)),
  compare: (ids) => API.post('/compare', { ids }),
  recommend: (payload) => API.post('/recommend', payload),
  analyzeStream: async function*(payload) {
    const r = await fetch('/api/recommend/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (r.status === 429) {
      const err = await r.json();
      throw new Error(err.error || '今日 AI 分析次数已用完，请明天再试');
    }
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          yield data;
        }
      }
    }
  },
};
window.API = API;
