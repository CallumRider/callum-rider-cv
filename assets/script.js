const cadetPhotos = [
    "assets/images/cadet1.jpg",
    "assets/images/cadet2.jpg",
    "assets/images/cadet3.jpg",
    "assets/images/cadet4.jpg",
    "assets/images/cadet5.jpg",
    "assets/images/cadet6.jpg",
    "assets/images/cadet7.jpg"
];

let currentPhoto = 0;

function changePhoto(direction){

    currentPhoto += direction;

    if(currentPhoto < 0){
        currentPhoto = cadetPhotos.length - 1;
    }

    if(currentPhoto >= cadetPhotos.length){
        currentPhoto = 0;
    }

    document.getElementById("cadet-photo").src = cadetPhotos[currentPhoto];

}
