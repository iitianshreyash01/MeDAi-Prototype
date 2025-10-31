// MEDAi_Prototype/server.js - Simple Prototype Server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// In-memory database (prototype only)
const db = {
  users: [],
  symptoms: [],
  appointments: [],
  medicines: {
    'paracetamol': { brand: 'Crocin', price: 120, substitute: 'Dolo' },
    'ibuprofen': { brand: 'Brufen', price: 150, substitute: 'Combiflam' },
    'amoxicillin': { brand: 'Amoxycare', price: 250, substitute: 'Moxikind' },
  },
  doctors: [
    { id: 1, name: 'Dr. Raj Kumar', specialty: 'Cardiology', fee: 500 },
    { id: 2, name: 'Dr. Priya Singh', specialty: 'Neurology', fee: 400 },
    { id: 3, name: 'Dr. Arun Patel', specialty: 'Gastroenterology', fee: 350 },
  ],
  specialists: {
    'cardiology': { name: 'Cardiology', icon: 'Heart', conditions: ['chest pain', 'high bp'] },
    'neurology': { name: 'Neurology', icon: 'Brain', conditions: ['headache', 'migraine'] },
    'pulmonology': { name: 'Pulmonology', icon: 'Lungs', conditions: ['cough', 'asthma'] },
  }
};

// Symptom analysis database
const symptomAnalysis = {
  'fever,cough': { condition: 'Cold/Flu', severity: 'medium', doctors: [1, 2] },
  'chest pain': { condition: 'Cardiac Issue', severity: 'high', doctors: [1] },
  'headache': { condition: 'Tension Headache', severity: 'low', doctors: [2] },
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API Routes
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const user = {
        id: Date.now(),
        email: data.email,
        name: data.fullName,
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        user,
        message: 'Registration successful!'
      }));
    });
  }

  else if (pathname === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const user = db.users.find(u => u.email === data.email);
      if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          user,
          token: 'demo-token-' + user.id,
          message: 'Login successful!'
        }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid credentials' }));
      }
    });
  }

  else if (pathname === '/api/disease/analyze-symptoms' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const symptomKey = data.symptoms.join(',');
      const analysis = symptomAnalysis[symptomKey] || {
        condition: 'General Health Issue',
        severity: data.severity || 'medium',
        doctors: [1, 2, 3]
      };
      
      const record = {
        id: Date.now(),
        symptoms: data.symptoms,
        analysis,
        createdAt: new Date().toISOString()
      };
      db.symptoms.push(record);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        analysis: {
          symptoms: data.symptoms,
          possibleCondition: analysis.condition,
          severity: analysis.severity,
          recommendations: [
            'Rest and hydration',
            'Avoid stress',
            'Consult a doctor',
            'Take prescribed medicines'
          ],
          suggestedDoctors: analysis.doctors.map(id => 
            db.doctors.find(d => d.id === id)
          )
        }
      }));
    });
  }

  else if (pathname === '/api/doctors/specialties' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      specialties: Object.values(db.specialists)
    }));
  }

  else if (pathname === '/api/doctors' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      doctors: db.doctors
    }));
  }

  else if (pathname === '/api/medicine/compare-prices' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const medicine = db.medicines[data.medicineName.toLowerCase()];
      
      if (medicine) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          medicine: {
            name: data.medicineName,
            strength: data.strength,
            priceComparison: [
              { platform: 'PharmEasy', price: medicine.price, discount: 10 },
              { platform: 'NetMeds', price: medicine.price - 20, discount: 15 },
              { platform: '1mg', price: medicine.price + 10, discount: 5 }
            ],
            cheapestOption: { platform: 'NetMeds', price: medicine.price - 20 }
          }
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Medicine not found' }));
      }
    });
  }

  else if (pathname === '/api/appointments/book' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const appointment = {
        id: Date.now(),
        doctorId: data.doctorId,
        date: data.date,
        time: data.time,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      db.appointments.push(appointment);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        appointment,
        message: 'Appointment booked successfully!'
      }));
    });
  }

  else if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      server: 'MEDAi Prototype'
    }));
  }

  // Static files
  else if (pathname === '/' || pathname === '/index.html') {
    fs.readFile(path.join(__dirname, 'public/index.html'), (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  }

  else if (pathname.startsWith('/css/')) {
    const filename = path.join(__dirname, 'public', pathname);
    fs.readFile(filename, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(content);
      }
    });
  }

  else if (pathname.startsWith('/js/')) {
    const filename = path.join(__dirname, 'public', pathname);
    fs.readFile(filename, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(content);
      }
    });
  }

  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('  MEDAi Prototype Server Started');
  console.log('========================================');
  console.log('  URL: http://localhost:' + PORT);
  console.log('  Open this URL in your browser');
  console.log('  Press Ctrl+C to stop');
  console.log('========================================');
  console.log('');
});
