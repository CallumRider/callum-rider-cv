console.log("JS WORKING");

window.addEventListener("load", () => {

    // ======================
    // IMAGE CAROUSEL
    // ======================

    const track = document.getElementById("carousel-track");
    const dotsContainer = document.getElementById("carousel-dots");

    if (track && dotsContainer) {

        const totalPhotos = 7;
        let currentPhoto = 0;

        for (let i = 0; i < totalPhotos; i++) {

            const dot = document.createElement("span");

            if (i === 0) {
                dot.classList.add("active");
            }

            dot.onclick = function () {

                currentPhoto = i;
                updateCarousel();

            };

            dotsContainer.appendChild(dot);

        }


        function updateCarousel() {

            track.style.transform =
            `translateX(-${currentPhoto * 100}%)`;

            document.querySelectorAll(".carousel-dots span")
            .forEach((dot,index)=>{

                dot.classList.toggle(
                    "active",
                    index === currentPhoto
                );

            });

        }


        window.changePhoto = function(direction){

            currentPhoto += direction;


            if(currentPhoto < 0){
                currentPhoto = totalPhotos - 1;
            }


            if(currentPhoto >= totalPhotos){
                currentPhoto = 0;
            }


            updateCarousel();

        };


        setInterval(()=>{

            currentPhoto++;

            if(currentPhoto >= totalPhotos){
                currentPhoto = 0;
            }

            updateCarousel();

        },5000);

    }



    // ======================
    // STATISTICS COUNTERS
    // ======================

    const counters = document.querySelectorAll(".counter");


    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                const counter = entry.target;

                const target = Number(counter.dataset.target);

                let count = 0;


                const updateCounter = () => {

                    count += target / 60;

                    if(count < target){

                        counter.innerText =
                        Math.ceil(count) + "+";

                        setTimeout(updateCounter,20);

                    } else {

                        counter.innerText =
                        target + "+";

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



    // ======================
    // TIMELINE ANIMATION
    // ======================

    const timelineItems =
    document.querySelectorAll(".timeline-item");


    const timelineObserver =
    new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    },{
        threshold:0.2
    });


    timelineItems.forEach(item=>{

        timelineObserver.observe(item);

    });


});



// ======================
// MOBILE MENU
// ======================

const menuButton =
document.getElementById("menu-toggle");

const navLinks =
document.getElementById("nav-links");


if(menuButton && navLinks){

    menuButton.addEventListener("click",()=>{

        navLinks.classList.toggle("active");

    });

}
