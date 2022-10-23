const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
// const ctx = canvas.getContext('2d');
const ctx = canvas.getContext('2d', {willReadFrequently: true})
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const buttons = document.querySelectorAll('.mode ')

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
        modeEffect(pixels)
        // redEfffect(pixels)
        // rgbSplit(pixels)
        // ctx.globalAlpha = 0.1
        // pixels = greenScreen(pixels)
        // console.table(pixels.data)
        // debugger
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
        pixels.data[i + 23] = pixels.data[i + 3] 
        
    }
    return pixels
}
function rgbSplit(pixels){
    for(let i = 0; i<pixels.data.length; i+=4){
        pixels.data[i - 150] = pixels.data[i + 0] // ref
        pixels.data[i + 500] = pixels.data[i + 1] // green
        pixels.data[i - 550] = pixels.data[i + 2] // blue
        // pixels.data[i + 3] = pixels.data[i + 3] // alpha
    }
    return pixels
}
function greenScreen(pixels){
    const levels = {}

    document.querySelectorAll('.rgb input').forEach(input => {
        levels[input.name] = input.value
        // console.log(levels[input.name])
    })
    // console.table(levels)
    for(let i = 0; i < pixels.data.length; i+=4){
        red = pixels.data[i + 0] // red
        green = pixels.data[i + 1] // green
        blue = pixels.data[i + 2] // blue
        alpha = pixels.data[i + 3] // alpha

        if(red >= levels.rmin && green >= levels.gmin && blue >= levels
            .bmin && red <= levels.rmax && green <= levels.gmax && blue <= levels.bmax){
                //take it out or make alpha/opcity 0
                pixels.data[i + 3] = 0
            }
    }
    return pixels
}

function modeEffect(pixels){
    console.log(this.name)
    if(this.name === 'normal'){
        pixels = redEfffect(pixels)
        console.log('dor')
    }else if(this.name === 'redEffect'){
        // console.log('dar')
        pixels = rgbSplit(pixels)
    }
    return pixels
}

getVideo()   
buttons.forEach(button => button.addEventListener('click', modeEffect))
video.addEventListener('canplay', painToCanvas)

