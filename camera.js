let video = document.getElementById("video");
let message = document.getElementById("message");
let logo = document.getElementById("camera-logo");
let cameraThing = document.getElementById("camera-parent-div");
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