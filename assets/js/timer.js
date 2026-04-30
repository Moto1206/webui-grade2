function showTime() {
  
    const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
    const s = now.getSeconds();
    document.getElementById("clock").textContent =  h + ':' + m + ':' + s;

}


setInterval(showTime, 1000);

