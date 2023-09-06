let video = document.getElementById("video");
let message = document.getElementById("message");
let logo = document.getElementById("camera-logo");
let takePhotoButton = document.querySelector(".button-one");
let cameraThing = document.getElementById("camera-parent-div");
let canvas = document.getElementById("canvas");
let analyzedIngredientsList = [];
// let analyzedIngredientsHTML = "";
let ingredientsSectionElement = document.querySelector(".camera-ingredients-filter-section");
if (navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({ video: true })
		.then(function (stream) {
			video.srcObject = stream;
			message.classList.add("hide");
			logo.classList.add("hide");
			video.classList.remove("hide");
			cameraThing.classList.remove("big-box");
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
	setTimeout(() => {
		takePhotoButton.classList.remove("btn-danger");
		takePhotoButton.classList.add("btn-success");
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
	let analyzedIngredientsHTML = `<div class="d-grid gap-2"id="ingredients-analyzed-div">`;
	analyzedIngredientsList.forEach((ingredient) => {
		let percentage = Math.round(ingredient.value*100);
		// analyzedIngredientsHTML += `<button type="button" class="btn btn-success">${ingredient.name} - ${percentage}%</button>`;
		analyzedIngredientsHTML += `<button class="btn ingredient-button include-ingredient btn-success" type="button" value = "${ingredient.name}">${ingredient.name} - ${percentage}%</button>`;
	});
	analyzedIngredientsHTML += "</div>";
	ingredientsSectionElement.innerHTML = analyzedIngredientsHTML;
};