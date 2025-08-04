const dbClient = require('../db/conn')

const getAllUsers = async () => {
    const query = {
        text: `SELECT * FROM users;`
    }
    return await dbClient.query(query)
}

const getUserById = async (userId) => {
    const query = {
        text: `SELECT * FROM users WHERE id = $1;`,
        values: [userId]
    }

    const res = await dbClient.query(query)
    return res.rows[0]
}


module.exports = {
    getAllUsers,
    getUserById
}