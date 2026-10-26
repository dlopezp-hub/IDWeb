let cursos = require('../data/cursosData');

// GET filtrado por query string
exports.getAllCursos = (req, res) => {
  const { creditos } = req.query;
  let resultado = cursos;

  if (creditos) {
    resultado = resultado.filter(c => c.creditos === parseInt(creditos));
  }

  res.status(200).json({ status: 'success', count: resultado.length, data: resultado });
};

// GET id
exports.getCursoById = (req, res) => {
  const id = parseInt(req.params.id);
  const curso = cursos.find(c => c.id === id);

  if (!curso) {
    return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
  }

  res.status(200).json({ status: 'success', data: curso });
};

// POST 
exports.createCurso = (req, res) => {
  const { nombre, codigo, creditos } = req.body;

  if (!nombre || !codigo || !creditos) {
    return res.status(400).json({ status: 'fail', message: 'Faltan campos obligatorios (nombre, codigo, creditos)' });
  }

  const newCurso = {
    id: cursos.length > 0 ? Math.max(...cursos.map(c => c.id)) + 1 : 1,
    nombre,
    codigo,
    creditos: parseInt(creditos)
  };

  cursos.push(newCurso);
  res.status(201).json({ status: 'success', data: newCurso });
};

// PUT id
exports.updateCurso = (req, res) => {
  const id = parseInt(req.params.id);
  const index = cursos.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
  }

  const { nombre, codigo, creditos } = req.body;
  
  cursos[index] = {
    ...cursos[index],
    ...(nombre && { nombre }),
    ...(codigo && { codigo }),
    ...(creditos && { creditos: parseInt(creditos) })
  };

  res.status(200).json({ status: 'success', data: cursos[index] });
};

// DELETE id
exports.deleteCurso = (req, res) => {
  const id = parseInt(req.params.id);
  const index = cursos.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
  }

  cursos.splice(index, 1);
  res.status(200).json({ status: 'success', message: 'Curso eliminado correctamente' });
};