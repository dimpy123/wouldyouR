document.addEventListener("DOMContentLoaded", () => {

    const keys = document.querySelectorAll("#game button");
    console.log(keys);


    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const color = target.getAttribute("class");
            const redBut = document.getElementById("redBut");
            console.log(redBut);
            const blueBut = document.getElementById("blueBut");
            console.log(blueBut);

            if (color === 'red') {
                console.log("this is a red button");
                redBut.style = `background-color: green;border-color: green`;
                blueBut.style = `background-color: grey;border-color: grey`;
                return;
            }

            if (color === 'blue') {
                console.log("this is a blue button");
                blueBut.style = `background-color: green;border-color: green`;
                redBut.style = `background-color: grey;border-color: grey`;
                return;
            }
        }
    }
})