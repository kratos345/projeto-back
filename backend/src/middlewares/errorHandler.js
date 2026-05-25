exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  let status = err.status || 500;
  let message = err.message || 'Erro interno do servidor.';

  if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = err.errors.map((e) => e.message).join(', ') || 'Dados inválidos.';
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 400;
    message = err.errors?.map((e) => e.message).join(', ') || 'Registro duplicado.';
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    status = 400;
    message = 'Relacionamento inválido. Verifique os dados e tente novamente.';
  }

  if (err.name === 'SequelizeDatabaseError') {
    status = 400;
    message = err.parent?.message || err.message || 'Erro no banco de dados.';
  }

  const payload = { message };
  if (status === 500 && process.env.NODE_ENV !== 'production') {
    payload.error = err.toString();
  }

  res.status(status).json(payload);
};
