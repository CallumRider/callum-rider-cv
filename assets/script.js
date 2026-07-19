console.log("JS WORKING");
window.addEventListener("load", () => {

const track = document.getElementById("carousel-track");
const dotsContainer = document.getElementById("carousel-dots");

if(!track || !dotsContainer) return;


const totalPhotos = 7;
let currentPhoto = 0;


for(let i=0;i<totalPhotos;i++){

    const dot=document.createElement("span");

    if(i===0){
        dot.classList.add("active");
    }

    dot.onclick=function(){

        currentPhoto=i;
        updateCarousel();
        restartTimer();

    };

    dotsContainer.appendChild(dot);

}



function updateCarousel(){

    track.style.transform = `translateX(-${currentPhoto * 100}%)`;

    document.querySelectorAll(".carousel-dots span").forEach((dot,index)=>{

        dot.classList.toggle("active", index === currentPhoto);

    });

}



window.changePhoto=function(direction){

    currentPhoto += direction;


    if(currentPhoto < 0){
        currentPhoto = totalPhotos - 1;
    }


    if(currentPhoto >= totalPhotos){
        currentPhoto = 0;
    }


    updateCarousel();
    restartTimer();

}



let timer=setInterval(()=>{

    currentPhoto++;

    if(currentPhoto >= totalPhotos){
        currentPhoto=0;
    }

    updateCarousel();

},5000);



function restartTimer(){

    clearInterval(timer);

    timer=setInterval(()=>{

        currentPhoto++;

        if(currentPhoto >= totalPhotos){
            currentPhoto=0;
        }

        updateCarousel();

    },5000);

}


});

