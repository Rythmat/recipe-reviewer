const { client } = require('./client.cjs');

const fetchReviews = async( recipeId ) => {
  try {
    const {rows} = await client.query(`
      SELECT * FROM reviews WHERE recipe=${recipeId};
    `);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

const myReviews = async() => {
  //validateuser
  const myUser = null//token held variable
  try {
    const {rows} = await client.query(`
      SELECT * FROM reviews WHERE poster=${myUser.id};
    `);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

const postReview = async() => {
  //validateuser
  
}

module.exports = {
  fetchReviews,
  myReviews
}