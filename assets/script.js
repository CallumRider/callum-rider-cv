const track = document.getElementById("carousel-track");
const dotsContainer = document.getElementById("carousel-dots");

const totalPhotos = 7;
let currentPhoto = 0;

for(let i=0;i<totalPhotos;i++){

    const dot=document.createElement("span");

    if(i===0) dot.classList.add("active");

    dot.onclick=()=>{
        currentPhoto=i;
        updateCarousel();
        restartTimer();
    };

    dotsContainer.appendChild(dot);

}

function updateCarousel(){

    track.style.transform=`translateX(-${currentPhoto*100}%)`;

    document.querySelectorAll(".carousel-dots span").forEach((dot,index)=>{

        dot.classList.toggle("active",index===currentPhoto);

    });

}

function changePhoto(direction){

    currentPhoto+=direction;

    if(currentPhoto<0) currentPhoto=totalPhotos-1;

    if(currentPhoto>=totalPhotos) currentPhoto=0;

    updateCarousel();

    restartTimer();

}

let timer=setInterval(nextPhoto,5000);

function nextPhoto(){

    currentPhoto++;

    if(currentPhoto>=totalPhotos) currentPhoto=0;

    updateCarousel();

}

function restartTimer(){

    clearInterval(timer);

    timer=setInterval(nextPhoto,5000);

}
