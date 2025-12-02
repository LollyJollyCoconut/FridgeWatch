let apiURL;
let apiResponse;
let recipeResultsList;
let recipeResultsSection = document.querySelector(".results-cards-container");
const addIngredientInputText = document.querySelector(".add-ingredients-text");
const addIngredientButton = document.querySelector(".add-ingredient-button");
const suggestRecipesButton = document.querySelector(".suggest-recipes-button");
const inventoryUl = document.querySelector(".inventory-list-ul");
const ingredientSuggestionsDropdownDiv = document.querySelector("#ingredient-suggestions");
const inventoryResultsSection = document.querySelector(".inventory-results-section");
const selectAllInventoryButton = document.querySelector(".select-all-inventory-button");
let selectAllInventoryButtonMode = "select";
const deleteAllInventoryButton = document.querySelector(".delete-all-inventory-button");
let searchQueryList = [];
const searchQueryDisplayDiv = document.querySelector("#selected-ingredients-div");
let invalidIngredientModal = new bootstrap.Modal(document.getElementById('invalid-ingredient-modal'));
let duplicateIngredientModal = new bootstrap.Modal(document.getElementById("duplicate-ingredient-modal"));
let emptyInventoryModal = new bootstrap.Modal(document.getElementById("empty-inventory-modal"));
function addIngredient() {
	const ingredientText = addIngredientInputText.value.trim().toLowerCase();
	if (!ingredientText) {
		return;
	}
	let isValidIngredient = false;
	for (let i = 0; i < ingredientsList.length; i++) {
		if (ingredientsList[i].ingredientName === ingredientText) {
			isValidIngredient = true;
			break;
		}
	}
	if (!isValidIngredient) {
		invalidIngredientModal.show();
		return;
	}
	let tempInventoryList;
	if (localStorage.getItem("inventoryList")) {
		tempInventoryList = JSON.parse(localStorage.getItem("inventoryList"));
	} else {
		tempInventoryList = [];
	}	
	if (tempInventoryList.includes(ingredientText)) {
		duplicateIngredientModal.show();
		return;
	}
	tempInventoryList.push(ingredientText);
	localStorage.setItem("inventoryList", JSON.stringify(tempInventoryList));
	addIngredientInputText.value = "";
	renderInventoryList(tempInventoryList);
	ingredientSuggestionsDropdownDiv.innerHTML = "";
}
addIngredientButton.addEventListener("click", function() {
	addIngredient();
});
addIngredientInputText.addEventListener("keydown", function (event) {
	if (event.key === "Enter") {
		event.preventDefault();
		addIngredient();
	}
});
function renderInventoryList(invList) {
	inventoryUl.innerHTML = "";
	if (!invList || invList.length ===0) {
		inventoryUl.innerHTML = `<li class = "list-group-item text-center text-muted">
			Your inventory is Empty.
		</li>`;
		return;
	}
	let listHTML = "";
	invList.forEach((ingredient, index) => {
		const checkboxId = `ingredientCheckbox${index}`;
		listHTML += `<li class = "list-group-item d-flex justify-content-between align-items-center inventory-list-item">
			<label class = "flex-grow-1 d-flex align-items-center" for = "${checkboxId}">
				<input type = "checkbox" class = "form-check-input flex-shrink-0 ingredient-checkbox me-2" id = "${checkboxId}" value = "${ingredient}" ${searchQueryList.includes(ingredient) ? "checked" : ""}>
				<span class = "text-wrap">${ingredient}</span>
			</label>
			<button class = "btn btn-outline-danger delete-ingredient-button ms-2" type = "button" aria-label = "Delete inventory item" data-index = "${index}">x</button>
		</li>`;
	});
	inventoryUl.innerHTML = listHTML;
	const deleteButtons = inventoryUl.querySelectorAll(".delete-ingredient-button");
	console.log(deleteButtons);
	deleteButtons.forEach(button => {
		button.addEventListener("click", function() {
			const index = parseInt(button.getAttribute("data-index"));
			console.log(index);
			deleteIngredient(index);
		});
	});
	const inventoryCheckboxes = inventoryUl.querySelectorAll(".ingredient-checkbox");
	inventoryCheckboxes.forEach(checkbox => {
		checkbox.addEventListener("change", function() {
			const ingredient = this.value;
			if (this.checked) {
				addToSearchQuery(ingredient);
			}
			else {
				removeFromSearchQuery(ingredient);
			}
			updateSelectAllButtonMode();
		});
	});
}
document.addEventListener("DOMContentLoaded", function(){
	const savedInventory = JSON.parse(localStorage.getItem("inventoryList")) || [];
	renderInventoryList(savedInventory);
});
function deleteIngredient(index) {
	let tempInventoryList = JSON.parse(localStorage.getItem("inventoryList")) || [];
	if (index < 0 || index >= tempInventoryList.length) {
		console.log("Invalid index passed to deleteIngredient:", index);
		return;
	}
	const removedIngredient = tempInventoryList[index];
	tempInventoryList.splice(index, 1);
	const searchQueryIndex = searchQueryList.indexOf(removedIngredient);
	if (searchQueryIndex !== -1) {
		searchQueryList.splice(searchQueryIndex, 1);
		updateSelectedIngredientsDisplay();
	}
	localStorage.setItem("inventoryList", JSON.stringify(tempInventoryList));
	renderInventoryList(tempInventoryList);
	updateSelectAllButtonMode();
}
function deleteAllIngredients() {
	const confirmDelete = confirm("Are you sure you want to delete all items from your inventory?");
	if (!confirmDelete) {
		return;
	} else {
		localStorage.removeItem("inventoryList");
		renderInventoryList([]);
	}
}
deleteAllInventoryButton.addEventListener("click", deleteAllIngredients);
function updateSelectedIngredientsDisplay() {
	console.log("updating search query");
	if (searchQueryList.length === 0) {
		searchQueryDisplayDiv.innerHTML = "<em> No ingredients selected. </em>";
	}
	else {
		searchQueryDisplayDiv.innerHTML = searchQueryList
		.map(ingredient => `<span class = "badge bg-success me-1">${ingredient}</span>`)
		.join("");
	}
}
function updateSelectAllButtonMode() {
	console.log("updating select all button mode");
	const inventoryCheckboxes = inventoryUl.querySelectorAll(".ingredient-checkbox");
	const totalNumCheckboxes = inventoryCheckboxes.length;
	const checkedNumCheckboxes = Array.from(inventoryCheckboxes).filter(checkbox => checkbox.checked).length;
	if (checkedNumCheckboxes == 0) {
		selectAllInventoryButton.textContent = "Select All Items";
		selectAllInventoryButtonMode = "select";
	}else if (checkedNumCheckboxes == totalNumCheckboxes) {
		selectAllInventoryButton.textContent = "Deselect All Items";
		selectAllInventoryButtonMode = "deselect";
	}else {
		selectAllInventoryButton.textContent = "Select All Items";
		selectAllInventoryButtonMode = "select";
	}
}
document.addEventListener("click", function (event) {
	if (!ingredientSuggestionsDropdownDiv.contains(event.target) && event.target !== addIngredientInputText) {
		ingredientSuggestionsDropdownDiv.innerHTML = "";
	}
});
function toggleSelectAllMode() {
	const inventoryCheckboxes = inventoryUl.querySelectorAll(".ingredient-checkbox");
	if (selectAllInventoryButtonMode == "select") {
		console.log("selecting all");
		inventoryCheckboxes.forEach(function(checkbox) {
			if (!checkbox.checked) {
				checkbox.checked = true;
				addToSearchQuery(checkbox.value);
			}
		});
		selectAllInventoryButton.textContent = "Deselect All Items";
		selectAllInventoryButtonMode = "deselect";
	}
	else {
		console.log("deselecting all now");
		inventoryCheckboxes.forEach(function(checkbox) {
			if (checkbox.checked) {
				checkbox.checked = false;
				removeFromSearchQuery(checkbox.value);
			}
		});
		selectAllInventoryButton.textContent = "Select All Items";
		selectAllInventoryButtonMode = "select";
	}
}
selectAllInventoryButton.addEventListener("click", toggleSelectAllMode);
function addToSearchQuery(ingredient) {
	if (!searchQueryList.includes(ingredient)) {
		searchQueryList.push(ingredient);
		updateSelectedIngredientsDisplay();
		console.log("Added: ", ingredient, "Current searchQueryList: ", searchQueryList);
	}
}
function removeFromSearchQuery(ingredient) {
	const index = searchQueryList.indexOf(ingredient);
	if (index > -1) {
		searchQueryList.splice(index, 1);
		updateSelectedIngredientsDisplay();
		console.log("Removed:", ingredient, "Current searchQueryList:", searchQueryList);
	}
}
function showSuggestedIngredientsDropdown(query) {
	if (!query) {
		query = "";
	}
	const matchedByCategory = {};
	ingredientsList.forEach(function(item) {
		if (item.ingredientName.toLowerCase().includes(query.toLowerCase())) {
			if (!matchedByCategory[item.category]) {
				matchedByCategory[item.category] = [];
			}
			matchedByCategory[item.category].push(item.ingredientName);
		}
	});
	let suggestionsHTML = "";
	if (Object.keys(matchedByCategory).length === 0) {
		suggestionsHTML = '<div class = "list-group-item text-muted">No matches found</div>';
	}
	else{
		for (const category in matchedByCategory) {
			suggestionsHTML += `<div class = "kist-group-item bg-success-subtle text-success-emphasis fw-bolder text-capitalize suggested-ingredient-category">${category}</div>`;
			matchedByCategory[category].forEach(function(ingredient) {
				suggestionsHTML += `<button type = "button" class = "list-group-item list-group-item-action ingredient-suggestion-button" data-ingredient = "${ingredient}"> ${ingredient}</button>`;
			});
		}
	}
	ingredientSuggestionsDropdownDiv.innerHTML = suggestionsHTML;
	const suggestedIngredientButtonList = ingredientSuggestionsDropdownDiv.querySelectorAll(".ingredient-suggestion-button");
	suggestedIngredientButtonList.forEach(function(button) {
		button.addEventListener("click", function () {
			const selectedIngredient = this.getAttribute("data-ingredient");
			addIngredientInputText.value = selectedIngredient;
			ingredientSuggestionsDropdownDiv.innerHTML = "";
			addIngredient();
		});
	});
}
addIngredientInputText.addEventListener("input", function() {
	const query = this.value.trim().toLowerCase();
	showSuggestedIngredientsDropdown(query);
});
addIngredientInputText.addEventListener("focus", function() {
	const query = this.value.trim().toLowerCase();
	showSuggestedIngredientsDropdown(query);
})
function getAndShowRecipesBasedOnInventory() {
	apiURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apikey}&addRecipeInformation=true&number=100`;
	if (searchQueryList.length > 0) {
		apiURL += `&includeIngredients=${searchQueryList}`;
	} else {
		let tempInventoryList;
		if (localStorage.getItem("inventoryList")) {
			tempInventoryList = JSON.parse(localStorage.getItem("inventoryList"));
			apiURL += `&includeIngredients=${tempInventoryList}`;
		} else {
			recipeResultsSection.innerHTML = "";
			emptyInventoryModal.show();
			return;
		}
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
		recipeResultsList = apiResponse.recipes;
		displayResults();
		inventoryResultsSection.scrollIntoView({
			behavior: "smooth",
			block: "start",
			inline: "nearest"
		});
	})
	.catch(err => {
		console.error(err);
	});
}
suggestRecipesButton.addEventListener("click", getAndShowRecipesBasedOnInventory);

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
            <div class = "card card-recipe" data-recipe-id = "${recipe.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
              <img src = ${recipe.image} alt = "${recipe.title}" data-recipe-index = "${index}" data-recipe-id = "${recipe.id}" class = "recipe-card-image">
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
		populateRecipeModal(data, ingredientsListFromRecipe, nutritionFromRecipe);
	})
	.catch(err => {
		console.error(err);
	});
});