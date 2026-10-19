const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const { method, url } = req;

  //RUTAS (API)
  if (url === '/api/estudiantes') {
    
    // GET /api/estudiantes 
    if (method === 'GET') {
      const filePath = path.join(__dirname, 'data', 'estudiantes.json');
      
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Error al leer los datos' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });

    } else if (method === 'POST') {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const nuevoEstudiante = JSON.parse(body);
          const filePath = path.join(__dirname, 'data', 'estudiantes.json');

          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ message: 'Error interno del servidor' }));
            }

            const estudiantes = JSON.parse(data);
            estudiantes.push(nuevoEstudiante);

            fs.writeFile(filePath, JSON.stringify(estudiantes, null, 2), err => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Error al guardar los datos' }));
              }
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(nuevoEstudiante));
            });
          });
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Formato JSON inválido' }));
        }
      });
    }

  } else {
    let fileName = url === '/' ? 'index.html' : url;
    const filePath = path.join(__dirname, 'public', fileName);
    const extname = path.extname(filePath);

    // Detección básica de Content-Type
    let contentType = 'text/html';
    if (extname === '.css') contentType = 'text/css';
    if (extname === '.js') contentType = 'text/javascript';
    if (extname === '.json') contentType = 'application/json';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        //(404 Not Found)
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Recurso no encontrado' }));
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});