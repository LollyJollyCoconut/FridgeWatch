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

let ingredientsSearchSection = document.getElementById("ingredients-search-section");
categoriesList.forEach(function(category) {
	let categoryClass = category.replaceAll(' ','-');
	ingredientsSearchSection.innerHTML += `<section class = "ingredients-category-list ${categoryClass}">
		<div class = "ingredients-category-header">
			<!-- <h3 class = "ingredients-category-heading">${category}</h3> -->
			<button class = "btn btn-outline-dark show-ingredients-button col-12" type = "button" data-bs-toggle = "collapse" data-bs-target = "#collapse-${categoryClass}" aria-expanded = "false" aria-controls = "collapse-${categoryClass}">
				<span class = "ingredients-category-heading">${category} </span>
				<span class = "down-arrow">╲╱</span>
				<span class = "up-arrow">╱╲</span>
			</button>
		</div>
	</section>`;
});