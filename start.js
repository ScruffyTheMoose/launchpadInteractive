// JS file to manage the start button and build the grid for plotting elevations and colors

function start() {

    let main = document.createElement("div")
    main.className = "main";
    main.id = "main";
    document.getElementById("body").appendChild(main);

    let cont = document.createElement("div")
    cont.className = "grid-container";
    cont.id = "grid-cont-upper";
    document.getElementById("main").appendChild(cont);

    for (let i = 1; i <= 32; i++) {
        let b = document.createElement("button");
        b.className = "box";
        let node = document.createTextNode(i);
        b.appendChild(node);

        document.getElementById("grid-cont-upper").appendChild(b);
    }

    let centerDiv = document.createElement("div")
    centerDiv.className = "center-div";
    centerDiv.id = "center-div";
    document.getElementById("main").appendChild(centerDiv);

    let center = document.createElement("button")
    center.className = "center";
    center.id = "center";
    let centerNode = document.createTextNode("YOUR LOCATION");
    center.appendChild(centerNode);
    document.getElementById("center-div").appendChild(center);

    cont = document.createElement("div")
    cont.className = "grid-container";
    cont.id = "grid-cont-lower";
    document.getElementById("main").appendChild(cont);

    for (let i = 33; i <= 64; i++) {
        let b = document.createElement("button");
        b.className = "box";
        let node = document.createTextNode(i);
        b.appendChild(node);

        document.getElementById("grid-cont-lower").appendChild(b);
    }

    document.getElementById("start").remove();
}