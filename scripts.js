const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
// const ctx = canvas.getContext('2d');
const ctx = canvas.getContext('2d', {willReadFrequently: true})
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
        let pixels = ctx.getImageData(0, 0, width, height)
        pixels = redEfffect(pixels)
        ctx.putImageData(pixels, 0, 0)
    }, 16)
}

function takePhoto(){
    //geting the sound
    snap.currentTime = 0
    snap.play()

    //take the data out of the canvas  
    const data = canvas.toDataURL('image/jpeg')
    const link = document.createElement('a')
    link.href = data 
    link.setAttribute('download', 'handsome')
    link.innerHTML = `<img src="${data}" alt="Coolest man on the earth" />`
    strip.insertBefore(link, strip.firstChild)
    console.log(data)
}
function redEfffect(pixels){
    for(let i = 0; i<pixels.data.length; i+=4){
        pixels.data[i + 0] = pixels.data[i + 0] + 100 
        pixels.data[i + 1] = pixels.data[i + 1] - 50 
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 
    }
    return pixels
}

// getVideo()

video.addEventListener('canplay', painToCanvas)