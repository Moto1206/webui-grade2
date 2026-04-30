let counter = 0

function increment() {
    counter++
    document.getElementById("counter").innerText = counter
}

function decrement() {
    counter--
    document.getElementById("counter").innerText = counter
}


function reset() {
    counter = 0
    document.getElementById("counter").innerText = counter
}


setInterval(increment, 1000);