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

const myReviews = async(user) => {
  try {
    const {rows} = await client.query(`
      SELECT * FROM reviews WHERE poster=${user};
    `);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

const postReview = async(title,description,recipeId,userId) => {
  try {
    const {rows} = await client.query(`
      INSERT INTO reviews(title,description,recipe,poster)
      VALUES ('${title}','${description}',${recipeId},${userId})
      RETURNING *;
    `);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

const deleteReview = async(reviewId) => {
  try {
    await client.query(`
      DELETE FROM reviews WHERE id=${reviewId};
    `);
  } catch (error) {
    throw new Error('Delete Failure');
  }
}

module.exports = {
  fetchReviews,
  myReviews,
  postReview,
  deleteReview
}