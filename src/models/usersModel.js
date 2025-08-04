const dbClient = require('../db/conn')

const getAllUsers = async () => {
    try {
        const query = {
            name: 'get-all-users',
            text: `SELECT * FROM users;`
        }
        return await dbClient.query(query)
    } catch (error) {
        throw { status: error?.status ?? 500, message: error?.message ?? error }
    }
}

const getOneUser = async (userId) => {
    try {
        const query = {
            name: 'get-user',
            text: `SELECT * FROM users WHERE id = $1;`,
            values: [userId]
        }

        const res = await dbClient.query(query)

        if (res.rows.length === 0) {
            throw { status: 404, message: `Can't find user with ID '${userId}'` }
        }

        return res.rows[0]
    } catch (error) {
        throw { status: error?.status ?? 500, message: error?.message ?? error }
    }
}

const createOneUser = async (newUser) => {
    try {
        const { name, email, password, entry_date } = newUser

        const query = {
            name: 'create-user',
            text: `INSERT INTO users (name, email, password, entry_date) 
        VALUES ($1, $2, $3, $4) RETURNING *;`,
            values: [name, email, password, entry_date]
        }

        const created = await dbClient.query(query)
        return created.rows[0]
    } catch (error) {
        throw { status: error?.status ?? 500, message: error?.message ?? error }
    }

}

const updateOneUser = async (userId, changes) => {
    const fields = [] 
    const values = []

    if (changes.name !== undefined) {
        fields.push(`name = $${values.length + 1}`)
        values.push(changes.name)
    }

    if (changes.email !== undefined) {
        fields.push(`email = $${values.length + 1}`)
        values.push(changes.email)
    }

    if (changes.password !== undefined) {
        fields.push(`password = $${values.length + 1}`)
        values.push(changes.password)
    }

    values.push(userId)
    const idIndex = values.length

    try {
        const query = {
            text: `UPDATE users SET ${fields.join(', ')} WHERE id = $${idIndex} RETURNING *;`,
            values
        }

        const updated = await dbClient.query(query)

        if (updated.rows.length === 0) {
            throw { status: 404, message: `Can't find user with ID '${userId}'` }
        }

        return updated.rows[0]
    } catch (error) {
        throw { status: error?.status ?? 500, message: error?.message ?? error }
    }
}

const deleteOneUser = async (userId) => {
    try {
        const query = {
            name: 'delete-user',
            text: `DELETE FROM users WHERE id = $1 RETURNING *;`,
            values: [userId]
        }

        const deleted = await dbClient.query(query)

        if (deleted.rows.length === 0) {
            throw { status: 404, message: `Can't find user with ID '${userId}'` }
        }

        return deleted.rows[0]
    } catch (error) {
        throw { status: error?.status ?? 500, message: error?.message ?? error }
    }
}

module.exports = {
    getAllUsers,
    getOneUser,
    createOneUser,
    updateOneUser,
    deleteOneUser
}