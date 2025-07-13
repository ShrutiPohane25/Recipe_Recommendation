async function searchRecipes () {
  const ingredient = document.getElementById('ingredientInput').value.trim();
  const container  = document.getElementById('recipeResults');
  const loader     = document.getElementById('loader');

  container.innerHTML = '';
  loader.style.display = 'block';  // ⏳ Show loader

  if (!ingredient) {
    loader.style.display = 'none';
    container.textContent = 'Please enter an ingredient.';
    return;
  }

  try {
    const res  = await fetch(`http://localhost:3000/api/recipes/search?ingredient=${ingredient}`);
    const data = await res.json();

    loader.style.display = 'none';  // ✅ Hide loader

    if (data.error) {
      container.textContent = data.error;
      return;
    }

    if (data.length === 0) {
      container.textContent = 'No recipes found.';
      return;
    }

    data.forEach(recipe => {
      const card = document.createElement('div');
      Object.assign(card.style, {
        border:'1px solid #ccc', padding:'10px', marginBottom:'10px',
        borderRadius:'8px', boxShadow:'0 2px 4px rgba(0,0,0,0.1)', maxWidth:'300px'
      });

      card.innerHTML = `
        <h3>${recipe.title}</h3>
        <img src="${recipe.image}" alt="${recipe.title}" width="250" height="180"
             style="object-fit:cover;border-radius:5px;" />
        <button onclick="viewRecipe(${recipe.id})"
                style="margin-top:10px;padding:8px 16px;border-radius:5px;
                       background:#9e2a2b;color:#fff;border:none;cursor:pointer">
          View Recipe
        </button>`;
      container.appendChild(card);
    });
  } catch (err) {
    loader.style.display = 'none';  // ❌ Hide loader on error
    console.error('Error fetching recipes:', err);
    container.textContent = 'Something went wrong while fetching recipes.';
  }
}


async function viewRecipe (id) {
  try {
    const res  = await fetch(`http://localhost:3000/api/recipes/${id}`);
    const data = await res.json();

    /* strip HTML from summary & instructions */
    const summary       = data.summary      ? data.summary.replace(/<[^>]+>/g, '')      : 'No summary available.';
    const instructions  = data.instructions ? data.instructions.replace(/<[^>]+>/g, '') : '';
    const steps         = instructions.split(/[.\n]/).filter(s => s.trim().length > 5);
    const bulletHTML    = steps.map(s => `<li>${s.trim()}</li>`).join('');

    /* inject into modal */
    document.getElementById('modalTitle').textContent         = data.title;
    document.getElementById('modalSummary').textContent       = summary;
    document.getElementById('modalInstructions').innerHTML    = `<ul>${bulletHTML}</ul>`;

    /* show modal */
    document.getElementById('recipeModal').style.display = 'flex';
  } catch (err) {
    console.error('Error fetching recipe details:', err);
    alert('Failed to load recipe details.');
  }
}

/* 1‑liner to close the API recipe modal */
function closeRecipeModal () {
  document.getElementById('recipeModal').style.display = 'none';
}
