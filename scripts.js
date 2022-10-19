const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video : true, audio : false})
        .then(localMediaStream => {
            console.log(localMediaStream)
            video.srcObject = localMediaStream
            video.play()
        })
        .catch(err => {
            console.log(`OMG, WHYYY !!!`, err.message)
        })
}

function painToCanvas(){
    const {videoWidth : width, videoHeight : height} = video
    canvas.width = width
    canvas.height = height

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height)
    }, 16)
}

function takePhoto(){
    snap.currentTime = 0
    snap.play()
}

getVideo()

video.addEventListener('canplay', painToCanvas)