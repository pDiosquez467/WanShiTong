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

    const query = {
        text: `UPDATE pokemons SET ${fields.join(', ')} WHERE id = $${indiceId} RETURNING *;`,
		values: values,
        values
    }

    const updated = await dbClient.query(query)
    return updated.rows[0]
}

const deleteOneUser = async (userId) => {
    const query = {
        name: 'delete-user',
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
    updateOneUser,
    deleteOneUser
}