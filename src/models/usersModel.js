const dbClient = require('../db/conn')
const { executeQuery } = require('../utils/db')

const TABLE = 'users'

/**
 * Fetches all users from the database.
 * @returns {Promise<Object[]>} Array of user records.
 */
const getAllUsers = async () => {
  const query = {
    name: 'get-all-users',
    text: `SELECT * FROM ${TABLE};`
  }
  const res = await executeQuery(dbClient, query)
  return res.rows
}

/**
 * Fetches a single user by ID.
 * @param {number|string} userId – ID of the user to retrieve.
 * @returns {Promise<Object>} The user record.
 * @throws {404} If no user is found.
 */
const getOneUser = async (userId) => {
  const query = {
    name: 'get-user',
    text: `SELECT * FROM ${TABLE} WHERE id = $1;`,
    values: [userId]
  }
  const res = await executeQuery(dbClient, query)
  if (res.rows.length === 0) {
    throw { status: 404, message: `User with ID '${userId}' not found` }
  }
  return res.rows[0]
}

/**
 * Creates a new user. Server sets the entry date.
 * @param {Object} newUser – { name, email, password }
 * @returns {Promise<Object>} The newly created user.
 */
const createOneUser = async (newUser) => {
  const entry_date = new Date().toISOString()
  const { name, email, password } = newUser

  const query = {
    name: 'create-user',
    text: `
      INSERT INTO ${TABLE} (name, email, password, entry_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
    values: [name, email, password, entry_date]
  }
  const res = await executeQuery(dbClient, query)
  return res.rows[0]
}

/**
 * Updates allowed fields of a user.
 * @param {number|string} userId – ID of the user to update.
 * @param {Object} changes – Fields to update (name, email, password).
 * @returns {Promise<Object>} The updated user record.
 * @throws {400} If no valid fields are provided.
 * @throws {404} If no user is found.
 */
const updateOneUser = async (userId, changes) => {
  const allowed = ['name', 'email', 'password']
  const entries = Object.entries(changes).filter(([key]) =>
    allowed.includes(key)
  )

  if (entries.length === 0) {
    throw { status: 400, message: 'No valid fields to update' }
  }

  const fields = entries.map(([key], i) => `${key} = $${i + 1}`)
  const values = entries.map(([, value]) => value)
  values.push(userId)

  const query = {
    name: 'update-user',
    text: `
      UPDATE ${TABLE}
      SET ${fields.join(', ')}
      WHERE id = $${values.length}
      RETURNING *;
    `,
    values
  }

  const res = await executeQuery(dbClient, query)
  if (res.rows.length === 0) {
    throw { status: 404, message: `User with ID '${userId}' not found` }
  }
  return res.rows[0]
}

/**
 * Deletes a user by ID.
 * @param {number|string} userId – ID of the user to delete.
 * @returns {Promise<Object>} The deleted user record.
 * @throws {404} If no user is found.
 */
const deleteOneUser = async (userId) => {
  const query = {
    name: 'delete-user',
    text: `DELETE FROM ${TABLE} WHERE id = $1 RETURNING *;`,
    values: [userId]
  }
  const res = await executeQuery(dbClient, query)
  if (res.rows.length === 0) {
    throw { status: 404, message: `User with ID '${userId}' not found` }
  }
  return res.rows[0]
}

module.exports = {
  getAllUsers,
  getOneUser,
  createOneUser,
  updateOneUser,
  deleteOneUser
}
