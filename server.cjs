const { postRecipe, fetchRecipes, getOneRecipe } = require('./db/recipes.cjs');
const { fetchReviews, myReviews } = require('./db/reviews.cjs');
const { createUser, authenticateUser } = require('./db/users.cjs');

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
app.get('/api/auth/me', (req,res,next) => {
  //validate user
})
app.get('/api/reviews/me', (req,res,next) => {
  //validate user
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
    localStorage.setItem('token',token);
    res.status(200).send('Logged In!');
  } catch (error) {
    console.log(error);
  }
})



app.listen(3000, (req,res,next) => {
  console.log("Listening on PORT 3000");
})