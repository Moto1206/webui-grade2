
function changeText() {
    document.getElementById("result").textContent = "クリックされました！";
}


document.getElementById("btn").addEventListener("click", changeText);