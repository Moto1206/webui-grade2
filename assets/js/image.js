let name = "baby blu";
let number = 10;
let flag = true;
let flag2 = false;




let isCat = true;

function changePic() {
    const img = document.getElementById("photo");
    if (isCat) {
        img.src = "assets/images/dog.jpg";
    } else {
        img.src = "assets/images/cat.jpg";
    }
    isCat = !isCat;
}

setInterval(changePic, 1000);
