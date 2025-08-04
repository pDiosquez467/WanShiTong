const dbClient = require('../db/conn')

const getAllUsers = () => {
    const query = {
        text: `SELECT * FROM users;`
    }
    return dbClient.query(query)
}


module.exports = {
    getAllUsers
}