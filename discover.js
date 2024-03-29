let apiURL;
let apiResponse;
let recipeResultsList;
let recipeResultsSection = document.querySelector(".results-cards-container");
getAndShowRandomRecipes();

function getAndShowRandomRecipes() {
	apiURL = `https://api.spoonacular.com/recipes/random?apiKey=${apikey}&addRecipeInformation=true&number=100`;
	fetch(apiURL, {
		"method": "GET"
	})
	.then(response => {
		console.log("done");
		return response.json();
	})
	.then(data => {
		console.log(data);
		apiResponse = data;
		recipeResultsList = apiResponse.recipes;
		displayResults();
		recipeResultsSection.scrollIntoView({
			behavior: "smooth",
			block: "start",
			inline: "nearest"
		});
	})
	.catch(err => {
		console.error(err);
	});
}

function displayResults() {
	recipeResultsSection.innerHTML = "";
	console.log(recipeResultsList);
	recipeResultsList.forEach(function(recipe, index) {
		let cuisines = recipe.cuisines.toString().replaceAll(",",", ");
			if (cuisines == "") {
			cuisines = "None";
		}
		let diets = recipe.diets.toString().replaceAll(",",", ");
			if (diets == "") {
			diets = "None";
		}
		let dishTypes = recipe.dishTypes.toString().replaceAll(",",", ");
			if (dishTypes == ""){
			dishTypes = "none";
		}
		let summary = recipe.summary;
		let summaryptag = document.createElement(`p`);
		summaryptag.innerHTML = summary;
		let summarybtags = summaryptag.querySelectorAll("b");
		let summaryCalories;
		summarybtags.forEach(tag => {
			if (tag.innerText.search("calories")!= -1) {
				summaryCalories = tag.innerText;
			}
		});

		recipeResultsSection.innerHTML +=`<div class = "col" style = "text-transform: capitalize;">
            <div class = "card card-recipe" data-recipe-id = "${recipe.id}">
              <img src = ${recipe.image} alt = "${recipe.title}" data-recipe-index = "${index}" data-recipe-id = "${recipe.id}" data-bs-toggle="modal" data-bs-target="#exampleModal" class = "recipe-card-image">
              <div class = "card-body card-recipe-body">
                <h5 class = "card-title card-recipe-title">${recipe.title}</h5>
                <p class = "card-text"><span class = "card-recipe-label">Ready Time: </span><span class = "card-recipe-ready-time">${recipe.readyInMinutes} Minutes</span></p>
                <p class = "card-text"><span class = "card-recipe-label">Calories: </span><span class = "card-recipe-calories">${summaryCalories}</span></p>
                <p class = "card-text"><span class = "card-recipe-label">Cuisine: </span><span class = "card-recipe-cuisine">${cuisines}</span></p>
                <p class = "card-text"><span class = "card-recipe-label">Diet: </span><span class = "card-recipe-diet">${diets}</span></p>
                <p class = "card-text"><span class = "card-recipe-label">Meal Type: </span><span class = "card-recipe-meal-type">${dishTypes}</span></p>
              </div>
            </div>
          </div>`;
	});
}
function populateRecipeModal(recipe, recipeIngredientsList, recipeNutrition) {
	let modalRecipeCOntentDiv = document.querySelector(".modal-recipe-content");
	let cuisines = recipe.cuisines.toString().replaceAll(",",", ");
		if (cuisines == "") {
		cuisines = "None";
	}
	let diets = recipe.diets.toString().replaceAll(",",", ");
		if (diets == "") {
		diets = "None";
	}
	let dishTypes = recipe.dishTypes.toString().replaceAll(",",", ");
		if (dishTypes == ""){
		dishTypes = "none";
		}
	let summary = recipe.summary;
	let summaryptag = document.createElement(`p`);
	summaryptag.innerHTML = summary;
	let summarybtags = summaryptag.querySelectorAll("b");
	let summaryCalories;
	summarybtags.forEach(tag => {
		if (tag.innerText.search("calories")!= -1) {
			summaryCalories = tag.innerText;
		}
	});
	let prepTime = recipe.preparationMinutes;
	if (prepTime == -1) {
		prepTime = recipe.readyInMinutes;
	}
	modalRecipeCOntentDiv.innerHTML = `      <div class="modal-body modal-recipe-body">
        <img src = "${recipe.image}" alt = "${recipe.title}" class = "recipe-modal-image">
        <h3 class = "modal-recipe-header">${recipe.title}</h3>
        <p> <img class = "modal-recipe-icon" src="Icons/Ready Time Icon (1).png"><span class = "card-recipe-label">Ready Time: </span><span class = "modal-recipe-ready-time">${recipe.readyInMinutes} Minutes</span></p>
        <p><img class = "modal-recipe-icon" src="Icons/Calories Icon (1).png"><span class = "card-recipe-label">Calories: </span><span class = "modal-recipe-calories">${summaryCalories}</span></p>
        <p><img class = "modal-recipe-icon" src="Icons/Health Icon.png"><span class = "card-recipe-label">Health Score: </span><span class = "modal-recipe-cuisine">${recipe.healthScore}</span></p>
        <p><img class = "modal-recipe-icon" src="Icons/Diet Icon.png"><span class = "card-recipe-label">Diet: </span><span class = "modal-recipe-diet">${diets}</span></p>
        <p><img class = "modal-recipe-icon" src="Icons/Meal Type Icon.png"><span class = "card-recipe-label">Meal Type: </span><span class = "modal-recipe-meal-type">${dishTypes}</span></p>
        <p><img class = "modal-recipe-icon" src="Icons/Price Per Serving Icon.png"><span class = "card-recipe-label">Price Per Serving: </span><span class = "modal-recipe-servings">$${recipe.pricePerServing}/Serving</span></p>
        <p><img class = "modal-recipe-icon" src="Icons/Servings Icon.png"><span class = "card-recipe-label">Serving: </span><span class = "modal-recipe-price">${recipe.servings} serving(s)</span></p>
        <p><img class = "modal-recipe-icon" src="Icons/Cuisine Icon.png"><span class = "card-recipe-label">Cuisine: </span><span class = "modal-recipe-sustainable">${cuisines}</span></p>
        <p><img class = "modal-recipe-icon" src="Icons/Sustainability Icon(1).png"><span class = "card-recipe-label">Sustainability: </span><span class = "modal-recipe-health">${recipe.sustainable}</span></p>
        <p><img class = "modal-recipe-icon" src="Icons/Prep Time Icon.png"><span class = "card-recipe-label">Preparation Minutes: </span><span class = "modal-recipe-preparation">${prepTime} Minutes</span></p>
        <h4 class = "modal-recipe-header">Ingredients</h4>
        <div class = "modal-recipe-ingredients-div"></div>
        <h4 class = "modal-recipe-header">Instructions</h4>
        <ol class = "modal-recipe-instructions">
        </ol>
        <p><span class = "card-recipe-label">Credits: </span><span class = "modal-recipe-credit"><a href = "${recipe.sourceUrl}">${recipe.creditsText}</a></span></p>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>`;
  let stepsList = recipe.analyzedInstructions[0].steps;
  let instructionsOl = modalRecipeCOntentDiv.querySelector(".modal-recipe-instructions");
  stepsList.forEach(function(stepListItem){
  	let currentStep = document.createElement('li');
  	currentStep.innerText = stepListItem.step;
  	currentStep.classList.add("modal-recipe-step");
  	instructionsOl.append(currentStep);
  });
  let ingredientsDiv = modalRecipeCOntentDiv.querySelector(".modal-recipe-ingredients-div");
  let ingredientsHTML = "";
  recipeIngredientsList.forEach(function(ingredientObject){
  	let ingredientString = ingredientObject.name.replaceAll(' ','-');
  	ingredientsHTML += `<div class="form-check modal-recipe-ingredient-div">
	    <input class="form-check-input modal-recipe-ingredient" type="checkbox" value="${ingredientString}" id="${ingredientString}">
	    <label class="form-check-label" for="${ingredientString}">
	      ${ingredientObject.original}
	    </label>
	  </div>`;
  });
  ingredientsDiv.innerHTML = ingredientsHTML;

}
let recipeModalElement = document.getElementById('exampleModal');
recipeModalElement.addEventListener('show.bs.modal',function(event){
	let clickedOnImage = event.relatedTarget;
	let recipeIndex = clickedOnImage.dataset.recipeIndex;
	let clickedOnRecipe = recipeResultsList[recipeIndex];
	let apiResponseIngredients;
	let ingredientsListFromRecipe;
	let nutritionFromRecipe;
	let recipeApiUrl = `https://api.spoonacular.com/recipes/${clickedOnImage.dataset.recipeId}/information?apiKey=${apikey}&includeNutrition=true`;
	fetch(recipeApiUrl, {
		"method": "GET"
	})
	.then(response => {
		console.log("done getting ingredients");
		return response.json();
	})
	.then(data => {
		console.log(data);
		apiResponseIngredients = data;
		ingredientsListFromRecipe = apiResponseIngredients.extendedIngredients;
		nutritionFromRecipe = apiResponseIngredients.nutrition;
		populateRecipeModal(clickedOnRecipe, ingredientsListFromRecipe, nutritionFromRecipe);
	})
	.catch(err => {
		console.error(err);
	});
});