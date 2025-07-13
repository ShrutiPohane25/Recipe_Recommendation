const express = require('express');
const axios = require('axios');
const router = express.Router();

// 🔍 Search recipes by ingredient
router.get('/search', async (req, res) => {
  const ingredient = req.query.ingredient?.trim();
  if (!ingredient) return res.status(400).json({ error: 'Ingredient is required' });

  try {
    const { data } = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
      params: {
        ingredients: ingredient,
        number: 5,
        apiKey: process.env.SPOONACULAR_API_KEY
      }
    });

    const formatted = data.map(r => ({
      id: r.id,
      title: r.title,
      image: r.image,
      source: 'spoonacular'
    }));

    return res.json(formatted);
  } catch (err) {
    console.error('🔴 Spoonacular error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular.' });
  }
});

// 📋 Get full recipe details by ID
router.get('/:id', async (req, res) => {
  const recipeId = req.params.id;

  try {
    const { data } = await axios.get(
      `https://api.spoonacular.com/recipes/${recipeId}/information`,
      { params: { apiKey: process.env.SPOONACULAR_API_KEY } }
    );

    return res.json({
      id:           data.id,
      title:        data.title,
      image:        data.image,
      summary:      data.summary,
      instructions: data.instructions,
      source:       'spoonacular',
    });
  } catch (err) {
    console.error('🔴 Spoonacular detail error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch recipe details from Spoonacular.' });
  }
});

module.exports = router;
