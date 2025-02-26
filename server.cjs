const { postRecipe, fetchRecipes, getOneRecipe } = require('./db/recipes.cjs');
const { fetchReviews, myReviews, postReview, deleteReview } = require('./db/reviews.cjs');
const { createUser, authenticateUser, validateUser, getUserData } = require('./db/users.cjs');

const express = require('express');
const app = express();

const {client} = require('./db/client.cjs');
client.connect();


//MIDDLEWARE
app.use(express.json());
app.use((req,res,next) => {
  console.log('Request processed...');
  next();
});



//GETTERS
app.get('/api/recipes', async(req,res,next) => {
  const recipes = await fetchRecipes();
  res.send(recipes);
})
app.get('/api/recipes/:id', async(req,res,next) => {
  const {id} = req.params;
  const recipe = await getOneRecipe(id);
  res.send(recipe);
})
app.get('/api/recipes/:id/reviews', async(req,res,next) => {
  const {id} = req.params;
  const recipe = await getOneRecipe(id);
  const reviews = await fetchReviews(recipe.id);
  res.send(reviews);
})
app.get('/api/auth/me', async(req,res,next) => {
  const { token } = req.body;
  try {
    const user = await validateUser(token);
    const userData = await getUserData(user.username);
    res.send(userData)
  } catch (error) {
    res.status(404).send(error)
  }
})
app.get('/api/reviews/me', async(req,res,next) => {
  const { token } = req.body;
  try {
    const user = await validateUser(token);
    const reviews = await myReviews(user.id);
    res.send(reviews);
  } catch (error) {
    res.status(418).send(error);
  }
})



//POSTERS
app.post('/api/auth/register', async(req,res,next) => {
  try {
    const { username , email , password } = req.body;
    const newUser = createUser(username,email,password);
    res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
  }
})
app.post('/api/auth/login', async(req,res,next) => {
  try {
    const { username, password } = req.body;
    const token = await authenticateUser(username, password);
    res.status(200).send({token: token});
  } catch (error) {
    res.send({message: 'Bad Credentials' });
  }
})
app.post('/api/recipes/:id/reviews', async(req,res,next) => {
  const { id } = req.params;
  const { token, title, description } = req.body;
  try {
    const user = await validateUser(token);
    const review = await postReview(title,description,id,user.id);
    res.status(200).send(review);
  } catch (error) {
    console.log(error);
  }
})



//DELETER
app.delete('/api/reviews/:id', async(req,res,next) => {
  const { id } = req.params;
  const { token } = req.body;
  try {
    await validateUser(token);
    await deleteReview(id);
    res.status(200).send('Review Deleted!');
  } catch (error) {
    console.log(error)
  }
})


app.listen(3000, (req,res,next) => {
  console.log("Listening on PORT 3000");
})