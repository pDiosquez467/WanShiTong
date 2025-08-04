const dbClient = require('../db/conn')

const getAllUsers = async () => {
    const query = {
        name: 'get-all-users',
        text: `SELECT * FROM users;`
    }
    return await dbClient.query(query)
}

const getOneUser = async (userId) => {
    const query = {
        name: 'get-user',
        text: `SELECT * FROM users WHERE id = $1;`,
        values: [userId]
    }

    const res = await dbClient.query(query)
    return res.rows[0]
}

const createOneUser = async (newUser) => {

    const { name, email, password, entry_date } = newUser

    const query = {
        name: 'create-user',
        text: `INSERT INTO users (name, email, password, entry_date) 
        VALUES ($1, $2, $3, $4) RETURNING *;`,
        values: [name, email, password, entry_date]
    }

    const created = await dbClient.query(query)
    return created.rows[0] 
}

const deleteOneUser = async (userId) => {
    const query = {
        name: 'delete-one-user',
        text: `DELETE FROM users WHERE id = $1 RETURNING *;`,
        values: [userId]
    }

    const deleted = await dbClient.query(query)
    return deleted.rows[0]
}

module.exports = {
    getAllUsers,
    getOneUser,
    createOneUser,
    deleteOneUser
}