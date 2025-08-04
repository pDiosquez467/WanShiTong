const dbClient = require('../db/conn')

const { executeQuery } = require('../utils/db')

const TABLE = 'users'

const getAllUsers = async () => {
    const query = {
        name: 'get-all',
        text: `SELECT * FROM ${TABLE};`
    }
    const res = await executeQuery(dbClient, query)
    return res.rows
}

const getOneUser = async (userId) => {
    const query = {
        name: 'get-user',
        text: `SELECT * FROM ${TABLE} WHERE id = $1;`,
        values: [userId]
    }

    const res = await executeQuery(dbClient, query)

    if (res.rows.length === 0) {
        throw { status: 404, message: `Can't find user with ID '${userId}'` }
    }
    return res.rows[0]
}

const createOneUser = async (newUser) => {
    entry_date = new Date().toISOString()
    const { name, email, password } = newUser

    const query = {
        name: 'create-user',
        text: `INSERT INTO ${TABLE} (name, email, password, entry_date) 
        VALUES ($1, $2, $3, $4) RETURNING *;`,
        values: [name, email, password, entry_date]
    }

    const created = await executeQuery(dbClient, query)
    return created.rows[0]
}

const updateOneUser = async (userId, changes) => {
    const fields = [], values = []
    Object.entries(changes).forEach(([key, val], i) => {
        fields.push(`${key} = $${i + 1}`)
        values.push(val);
    })

    if (fields.length === 0) throw { status: 400, message: 'Nothing to update!' }

    values.push(id)
    const query = {
        text: `UPDATE ${TABLE} SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *;`,
        values,
    }

    const res = await executeQuery(dbClient, query)

    if (res.rows.length === 0) {
        throw { status: 404, message: `Can't find user with ID '${userId}'` }
    }

    return res.rows[0]
}

const deleteOneUser = async (userId) => {
    const query = {
        name: 'delete-user',
        text: `DELETE FROM ${TABLE} WHERE id = $1 RETURNING *;`,
        values: [userId]
    }

    const deleted = await executeQuery(dbClient, query)

    if (deleted.rows.length === 0) {
        throw { status: 404, message: `Can't find user with ID '${userId}'` }
    }

    return deleted.rows[0]
}

module.exports = {
    getAllUsers,
    getOneUser,
    createOneUser,
    updateOneUser,
    deleteOneUser
}