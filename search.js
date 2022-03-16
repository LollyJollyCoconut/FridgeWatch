let searchButton = document.querySelector(".search-ingredients-button");
let searchText = document.querySelector(".search-ingredients-text");
let apiURL;
let apiResponse;
let includedIngredientsList = [];
let excludedIngredientsList = [];
let includedIngredientsSpan = document.querySelector(".included-ingredients");
let excludedIngredientsSpan = document.querySelector(".excluded-ingredients");
let ingredientsSearchSection = document.getElementById("ingredients-search-section");
categoriesList.forEach(function(category) {
	let categoryClass = category.replaceAll(' ','-');
	ingredientsSearchSection.innerHTML += `<section class = "ingredients-category-list ${categoryClass} col-md-6">
		<div class = "ingredients-category-header">
			<button class = "btn btn-outline-dark show-ingredients-button col-12" type = "button" data-bs-toggle = "collapse" data-bs-target = "#collapse-${categoryClass}" aria-expanded = "false" aria-controls = "collapse-${categoryClass}">
				<span class = "ingredients-category-heading">${category} </span>
				<span class = "down-arrow">╲╱</span>
				<span class = "up-arrow">╱╲</span>
			</button>
		</div>
		<ul id="collapse-${categoryClass}" class="list-inline col-12 collapse"> </ul>
	</section>`;
});
ingredientsList.forEach(function(ingredient){
	let categoryClass = ingredient.category.replaceAll(' ','-');
	let desiredIngredientList = document.querySelector(`.${categoryClass} > ul`);
	let li = document.createElement("li");
	li.classList.add("list-inline-item");
	let button = document.createElement("button");
	button.classList = "btn btn-outline-success ingredient-button neutral-ingredient";
	button.type = "button";
	button.innerText = ingredient.ingredientName;
	li.appendChild(button);
	desiredIngredientList.appendChild(li);
	button.addEventListener("click", function(event) {
		if (button.classList.contains("exclude-ingredient")) {
			button.classList.remove("exclude-ingredient");
			button.classList.remove("btn-danger");
			button.classList.add("neutral-ingredient");
			button.classList.add("btn-outline-success");
			excludedIngredientsList = excludedIngredientsList.filter(ingredient => ingredient != event.target.innerText);
		}
		else if (button.classList.contains("include-ingredient")){
			button.classList.remove("include-ingredient");
			button.classList.remove("btn-success");
			button.classList.add("exclude-ingredient");
			button.classList.add("btn-danger");
			includedIngredientsList = includedIngredientsList.filter(ingredient => ingredient != event.target.innerText);
			excludedIngredientsList.push(event.target.innerText);
		}
		else {
			button.classList.remove("neutral-ingredient");
			button.classList.remove("btn-outline-success");
			button.classList.add("include-ingredient");
			button.classList.add("btn-success");
			includedIngredientsList.push(event.target.innerText);
		}
		includedIngredientsSpan.innerText = "";
		includedIngredientsList.forEach(function(ingredient) {
			includedIngredientsSpan.innerText += ` ${ingredient},`;
		});
		excludedIngredientsSpan.innerText = excludedIngredientsSpan.innerText.slice(0,-1);

		excludedIngredientsSpan.innerText = "";
		excludedIngredientsList.forEach(function(ingredient) {
			excludedIngredientsSpan.innerText += ` ${ingredient},`;
		});
		excludedIngredientsSpan.innerText = excludedIngredientsSpan.innerText.slice(0,-1);
	});
});
let searchForm = document.querySelector('form');
searchForm.addEventListener('submit', function (event) {
	searchButton.click();
	event.preventDeafault();
	event.stopPropagation();
}, false);
searchButton.addEventListener("click", function(event) {
	apiURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apikey}&addRecipeInformation=true`;
	if (searchText.value != "") {
		apiURL += `&query=${searchText.value}`;
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
	})
	.catch(err => {
		console.error(err);
	});
});