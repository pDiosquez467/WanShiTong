
const executeQuery = async (dbClient, query) => {
    try {
        return await dbClient.query(query)
    } catch (error) {
        throw { status: error?.status ?? 500, message: error?.message ?? error }
    }
}

module.exports = {
    executeQuery
}