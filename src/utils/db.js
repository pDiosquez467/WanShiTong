
async function executeQuery(query) {
  try {
    return await dbClient.query(query);
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    throw { status, message };
  }
}

module.exports = {
    executeQuery
}