// fetch("https://api.spoonacular.com/recipes/716429/information?includeNurtrition=true", {
// 	"method": "GET",
// 	"headers": {
// 		"apikey": "e9d8bd1f1f7e4330b38d9a687f20be20"
// 	}
// })

// .then(response => {
// 	console.log(response.json());
// })

// .catch(err => {
// 	console.error(err);
// });
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
	});
});