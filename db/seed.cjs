const { client } = require('./client.cjs');
const { createUser, authenticateUser, validateUser } = require('./users.cjs');
const { postRecipe } = require('./recipes.cjs');



const dropTables = async() => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS recipes;
      DROP TABLE IF EXISTS users;
    `);
  } catch (error) {
    console.log(error);
  }
}

const createTables = async() => {
  try {
    await client.query(`
      CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(30) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(70) NOT NULL
      );

      CREATE TABLE recipes(
      id SERIAL PRIMARY KEY,
      name VARCHAR(30) UNIQUE NOT NULL,
      ingredients VARCHAR(255) NOT NULL,
      instructions VARCHAR(1023) NOT NULL,
      creator INT REFERENCES users(id) NOT NULL
      );

      CREATE TABLE reviews(
      id SERIAL PRIMARY KEY,
      title VARCHAR(70) UNIQUE NOT NULL,
      description VARCHAR(255) NOT NULL,
      recipe INT REFERENCES recipes(id) NOT NULL,
      poster INT REFERENCES users(id) NOT NULL
      );
    `);
  } catch (error) {
    console.log(error);
  }
}


const databaSeed = async() => {
  console.log('Connecting to PostgreSQL...');
  await client.connect();
  console.log('Connected!');

  await dropTables();
  console.log('Tables Dropped!');

  await createTables();
  console.log('Tables Created!');

  const suser = await createUser('Taniwha','thisguy@gmail.com','testerday');
  console.log('Super-user Created');

  await authenticateUser('taniwha','testerday');
  console.log('User Authenticated');

  const recipe1 = await postRecipe('Perfect Rice','Rice,Water','Clean the rice. Boil the water with the rice inside a pot. Lower to a simmer and cover the pot. Remove from the heat when the water is evaporated.', suser.id);
  console.log('Recipe Posted!');

  console.log('Ending Post-sesh...');
  await client.end();
  console.log('Ended.');
}

databaSeed();

