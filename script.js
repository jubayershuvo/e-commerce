const btn = document.getElementsByClassName("btn")[0];

btn.onclick = () => {
    if (btn.innerHTML === "Click") {
        btn.innerHTML = "Clicked";
        btn.style.backgroundColor = "orange"
    } else if (btn.innerHTML === "Clicked") {
        btn.innerHTML = "Click";
        btn.style.backgroundColor = "blue"
    }
};

