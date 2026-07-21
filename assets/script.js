console.log("JS WORKING");
window.addEventListener("load", () => {

const track = document.getElementById("carousel-track");
const dotsContainer = document.getElementById("carousel-dots");

if(track && dotsContainer){

    // Carousel code goes here

}


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
}
// Statistics counter animation

const counters = document.querySelectorAll(".counter");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            const counter = entry.target;

            const target = +counter.dataset.target;

            let count = 0;

            const updateCounter = () => {

                const increment = target / 60;

                if(count < target){

                    count += increment;

                    counter.innerText = Math.ceil(count) + "+";

                    setTimeout(updateCounter,20);

                } else {

                    counter.innerText = target + "+";

                }

            };

            updateCounter();

            observer.unobserve(counter);

        }

    });

});


counters.forEach(counter => {

    observer.observe(counter);

});

// Timeline animation

const timelineItems = document.querySelectorAll(".timeline-item");


const timelineObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

}, {
    threshold:0.2
});

timelineItems.forEach(item => {

    timelineObserver.observe(item);

});


// ======================
// Mobile Menu
// ======================

const menuButton = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuButton && navLinks) {

   menuButton.addEventListener("click", () => {

    console.log("MENU CLICKED");

    navLinks.classList.toggle("active");

});

}

