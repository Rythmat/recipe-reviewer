const { client } = require('./client.cjs');


const postRecipe = async(name, ingredients, intructions, creator) => {
  try {
    //validate the user
    const {rows} = await client.query(`
      INSERT INTO recipes (name,ingredients,instructions,creator)
      VALUES ('${name}','${ingredients}','${intructions}',${creator})
      RETURNING *;
    `);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}


const fetchRecipes = async() => {
  try {
    const {rows} = await client.query(`
      SELECT * FROM recipes;
    `);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

const getOneRecipe = async(recipeId) => {
  try {
    const {rows} = await client.query(`
      SELECT * FROM recipes WHERE id=${recipeId};
    `);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  postRecipe,
  fetchRecipes,
  getOneRecipe
}