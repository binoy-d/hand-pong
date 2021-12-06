const video = document.getElementById("myvideo");
const video_canvas = document.getElementById("video-canvas");
const context = video_canvas.getContext("2d");
let trackButton;
let updateNote = document.getElementById("updatenote");
let data;
let isVideo = false;
let model = null;
const trackingButtonHTML = '<button onclick = "toggleVideo()" class="btn btn-primary mt-1" id="trackbutton">Enable Video</button>'

const modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 20, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
};

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking";
            isVideo = true;
            runDetection();
            if (trackButton) trackButton.remove();
        } else {
            updateNote.innerText = "Please enable video";
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video";
        startVideo();
    } else {
        updateNote.innerText = "Stopping video";
        handTrack.stopVideo(video);
        isVideo = false;
        updateNote.innerText = "Video stopped";
    }
}

function runDetection() {
    model.detect(video).then((predictions) => {
        //console.log("Predictions: ", predictions);
        data = predictions;
        model.renderPredictions(predictions, video_canvas, context, video);

        if (isVideo) requestAnimationFrame(runDetection);
    });
}

window.onload = function () {
    // Load the model.
    handTrack.load(modelParams).then((lmodel) => {
        // detect objects in the image.
        model = lmodel;
        updateNote.innerText = "Loaded Model!";
        var div = document.createElement('div');
        div.innerHTML = trackingButtonHTML;
        while (div.children.length > 0) {
            document.getElementById("header-top").appendChild(div.children[0]);
        }
        document.getElementById("updatenote").remove();
        trackButton = document.getElementById("trackbutton");
        setup();
        trackButton.disabled = false;
    });
};


