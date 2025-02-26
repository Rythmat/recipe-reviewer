const {client} = require('./client.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const createUser = async(usernameEntry,email,password) => {
  try {
    const hashword = await bcrypt.hash(password,10);
    const username = usernameEntry.toLowerCase();
    const {rows} = await client.query(`
      INSERT INTO users(username,email,password)
      VALUES ('${username}','${email}','${hashword}')
      RETURNING *;
    `);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

//Authenticates whether the input user's credentials are valid. Returning a token if they are.
const authenticateUser = async(usernameAttempt, passwordAttempt) => {
  try {
    const {rows} = await client.query(`
      SELECT * FROM users WHERE username='${usernameAttempt}';
    `);
    const user = rows[0];
    if(user){
      const pwCheck = await bcrypt.compare(passwordAttempt,user.password);
      if(pwCheck){
        const token = await jwt.sign({username: user.username}, process.env.JWT_SECRET);
        return token;
      }else{
        throw new Error('Bad Credentials');
      }
    }
  } catch (error) {
    throw new Error('Bad Credentials');
  }
}

const validateUser = async(token) => {
  try {
    const userData = await jwt.verify(token, process.env.JWT_SECRET);
    const {rows} = await client.query(`
      SELECT * FROM users WHERE username='${userData.username}';
    `);
    const user = rows[0];
    if(user){
      return { username: user.username, id: user.id }
    }else{
      return { message : 'Bad Token'};
    }
  } catch (error) {
    throw new Error('Bad Token');
  }
  
}

const getUserData = async(username) => {
  try {
    const {rows} = await client.query(`
      SELECT * FROM users WHERE username='${username}';
    `);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createUser,
  authenticateUser,
  validateUser,
  getUserData
}