let video = document.getElementById("video");
let message = document.getElementById("message");
let logo = document.getElementById("camera-logo");
if (navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({ video: true })
		.then(function (stream) {
			video.srcObject = stream;
			message.classList.add("hide");
			logo.classList.add("hide");
			video.classList.remove("hide");
		})
		.catch(function (error) {
			console.log("Something went wrong");
			console.log(error);
		});
}