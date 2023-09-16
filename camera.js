let video = document.getElementById("video");
let message = document.querySelector(".camera-message");
let takePhotoButton = document.querySelector(".button-one");
let canvas = document.getElementById("canvas");
let analyzedIngredientsList = [];
let ingredientsSectionElement = document.querySelector(".camera-ingredients-filter-section");
let includedIngredientsList = [];
let excludedIngredientsList = [];
let recipeResultsSection = document.getElementById("recipe-results-container");
let recipeResultsList = [];
let searchButton = document.querySelector(".button-two");
let includedIngredientsValues = "";
let excludedIngredientsValues = "";
let showCameraButton = document.querySelector(".button-three")
if (navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({ video: true })
		.then(function (stream) {
			video.srcObject = stream;
			message.classList.add("hide");
			video.classList.remove("hide");
			takePhotoButton.classList.remove("hide");
		})
		.catch(function (error) {
			console.log("Something went wrong");
			console.log(error);
		});
}

takePhotoButton.addEventListener("click", function(event) {
	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
	let image_data_url = canvas.toDataURL('image/jpeg').split(";base64,")[1];
	console.log(image_data_url);
	video.classList.add("hide");
	canvas.classList.remove("hide");
	takePhotoButton.classList.add("btn-danger");
	takePhotoButton.classList.remove("btn-success");
	takePhotoButton.disabled = true;
	setTimeout(() => {
		takePhotoButton.classList.remove("btn-danger");
		takePhotoButton.classList.add("btn-success");
		takePhotoButton.disabled = false;
		takePhotoButton.classList.add("hide");
		searchButton.classList.remove("hide");
		showCameraButton.classList.remove("hide");
	}, 2000);
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// In this section, we set the user authentication, user and app ID, model details, and the URL
	// of the image we want as an input. Change these strings to run your own example.
	//////////////////////////////////////////////////////////////////////////////////////////////////

	// Your PAT (Personal Access Token) can be found in the portal under Authentification
	const PAT = 'b3f978358e3449239618d3f90b9e098b';
	// Specify the correct user_id/app_id pairingss
	// Since you're making inferences outside your app's scope
	const USER_ID = 'clarifai';       
	const APP_ID = 'main';
	// Change these to whatever model and image URL you want to use
	const MODEL_ID = 'food-item-v1-recognition';
	const MODEL_VERSION_ID = 'dfebc169854e429086aceb8368662641';    
	const IMAGE_URL = 'https://images.pexels.com/photos/6608618/pexels-photo-6608618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

	///////////////////////////////////////////////////////////////////////////////////
	// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
	///////////////////////////////////////////////////////////////////////////////////

	const raw = JSON.stringify({
	    "user_app_id": {
	        "user_id": USER_ID,
	        "app_id": APP_ID
	    },
	    "inputs": [
	        {
	            "data": {
	                "image": {
	                    "base64": image_data_url
	                }
	            }
	        }
	    ]
	});

	const requestOptions = {
	    method: 'POST',
	    headers: {
	        'Accept': 'application/json',
	        'Authorization': 'Key ' + PAT
	    },
	    body: raw
	};

	// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
	// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
	// this will default to the latest version_id

	fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
	    .then(response => response.text())
	    .then(result => {
	    	console.log(result);
	    	analyzedIngredientsList = [
				{"name": "spaghetti",
				"value": 0.9787878 },
				{"name": "cheese",
				"value": 0.878767 },
				{"name": "tomato",
				"value": 0.5675765 },
				{"name": "avocado",
				"value": 0.423521 },
				{"name": "flour",
				"value": 0.213424 }
			];
	    	return JSON.parse(result);
		})

		.then(newResult => {
	    	analyzedIngredientsList = newResult["outputs"][0]["data"]["concepts"];
	    	console.log(analyzedIngredientsList);
	    	displayAnalyzedIngredients();
		})

	    .catch(error => console.log('error', error));

});
function displayAnalyzedIngredients() {
	includedIngredientsList = [];
	excludedIngredientsList = [];
	let buttonGridDiv = document.createElement("div");
	buttonGridDiv.classList = "d-grid gap-2";
	buttonGridDiv.id = "ingredients-analyzed-div";
	analyzedIngredientsList.forEach((ingredient) => {
		let percentage = Math.round(ingredient.value*100);
		let button = document.createElement("button");
		button.classList = "btn btn-outline-success ingredient-button neutral-ingredient";
		button.type = "button";
		button.innerText = `${ingredient.name} - ${percentage}`;
		button.value = ingredient.name;
		buttonGridDiv.appendChild(button);
		button.addEventListener("click", function(event) {
			if (button.classList.contains("exclude-ingredient")) {
				button.classList.remove("exclude-ingredient");
				button.classList.remove("btn-danger");
				button.classList.add("neutral-ingredient");
				button.classList.add("btn-outline-success");
				excludedIngredientsList = excludedIngredientsList.filter(ingredient => ingredient != event.target.value);
			}
			else if (button.classList.contains("include-ingredient")){
				button.classList.remove("include-ingredient");
				button.classList.remove("btn-success");
				button.classList.add("exclude-ingredient");
				button.classList.add("btn-danger");
				includedIngredientsList = includedIngredientsList.filter(ingredient => ingredient != event.target.value);
				excludedIngredientsList.push(event.target.value);
			}
			else {
				button.classList.remove("neutral-ingredient");
				button.classList.remove("btn-outline-success");
				button.classList.add("include-ingredient");
				button.classList.add("btn-success");
				includedIngredientsList.push(event.target.value);
			}
			includedIngredientsValues = "";
			includedIngredientsList.forEach(function(ingredient) {
				includedIngredientsValues += `${ingredient},`;
			});
			includedIngredientsValues = includedIngredientsValues.slice(0,-1);

			excludedIngredientsValues = "";
			excludedIngredientsList.forEach(function(ingredient) {
				excludedIngredientsValues += `${ingredient},`;
			});
			excludedIngredientsValues = excludedIngredientsValues.slice(0,-1);
		});
		// analyzedIngredientsHTML += `<button class="btn ingredient-button neutral-ingredient btn-outline-success" type="button" value = "${ingredient.name}">${ingredient.name} = ${percentage}%</button>`;
	});
	ingredientsSectionElement.innerHTML = "";
	ingredientsSectionElement.appendChild(buttonGridDiv);
	// ingredientsSectionElement.innerHTML = analyzedIngredientsHTML;
};

searchButton.addEventListener("click", function(event) {
	apiURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apikey}&addRecipeInformation=true&number=100`;
	// if (searchText.value != "") {
	// 	apiURL += `&query=${searchText.value}`;
	// }
	if (includedIngredientsList.length > 0) {
		apiURL += `&includeIngredients=${includedIngredientsValues}`;
	}
	if (excludedIngredientsList.length > 0) {
		apiURL += `&excludeIngredients=${excludedIngredientsValues}`;
	}

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
		recipeResultsList = apiResponse.results;
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
});

function displayResults() {
	recipeResultsSection.innerHTML = "";
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

		recipeResultsSection.innerHTML +=`<div class = "col-sm-6 col-md-4 col-lg-3" style = "text-transform: capitalize;">
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
showCameraButton.addEventListener("click", function(event) {
	searchButton.classList.add("hide");
	showCameraButton.classList.add("hide");
	takePhotoButton.classList.remove("hide");
	canvas.classList.add("hide");
	video.classList.remove("hide");
	recipeResultsSection.innerHTML = "";
	recipeResultsList = [];
	ingredientsSectionElement.innerHTML = "";
	includedIngredientsList = [];
	excludedIngredientsList = [];
});