


var p = [];
var p1=[];
var index = 1;
var colors = ["#e040fb", "#ff80ab", "#3f51b5", "#1e88e5", "#009688", "#4caf50", "#cddc39", "#ffeb3b", "#607d8b", "#ff9800"];

var pixel = 0;
var t = 0;


function addToList() {

    var at = document.getElementById("newat").value;
    var bt = document.getElementById("newbt").value;

    if (isNaN(parseInt(at)) && isNaN(parseInt(bt))) {
        window.alert("Please enter valid inputs");
        return;
    }


    if (parseInt(at) < 0 ) {
        window.alert("Invalid inputs");
        return;
    }

    p.push({
        "at": parseInt(at),
        "bt": bt,
        "rt": parseInt(bt),
        "id": index,
        "wt": 0,
        "tat": 0,
        "ct": 0,
        "valid": 0
    });

    index = index + 1;
    displayList();
    document.getElementById("newat").value = "";
    document.getElementById("newbt").value = "";
}

function addToList1() {

    var at = document.getElementById("newat1").value;
    var bt = document.getElementById("newbt1").value;
    alert(at);

    if (isNaN(parseInt(at)) && isNaN(parseInt(bt))) {
        window.alert("Please enter valid inputs");
        return;
    }
    if (isNaN(parseInt(at))) {
        window.alert("Please enter numeric value of arrival time");
        return;
    }
    if (isNaN(parseInt(bt))) {
        window.alert("Please enter numeric value of burst time");
        return;
    }
    if (parseInt(at) < 0 && parseInt(bt) <= 0) {
        window.alert("Invalid inputs");
        return;
    }
    if (parseInt(at) < 0) {
        window.alert("Please enter valid value of arrival time");
        return;
    }
    if (parseInt(bt) <= 0) {
        window.alert("Please enter positive value of burst time");
        return;
    }
    p1.push({
        "at": parseInt(at),
        "bt": parseInt(bt),
        "rt": parseInt(bt),
        "id": index,
        "wt": 0,
        "tat": 0,
        "ct": 0,
        "valid": 0
    });
    //window.alert("You submitted!");
    index = index + 1;
    displayList1();
    document.getElementById("newat1").value = "";
    document.getElementById("newbt1").value = "";
}

function displayList() {

    var inp = document.getElementById("showinput");
    //inp.setAttribute("style", "height:" + p.length * 80 + "px");
    var name=document.getElementById('Idname');
    name.setAttribute("style",'visibility: visible;');
    inp.innerHTML = "";
    for (var i = 0; i < p.length; i++) {
        var card = document.createElement("div");
        //card.setAttribute("class", "card");
        var pid = document.createElement("div");
        pid.textContent =  (i + 1) + ".    ";
        pid.setAttribute("style", "float:left;margin-left:20px;");
        //card.setAttribute("style", "float:left;");
        card.setAttribute("style", "width:800px;height: 50px;");
        var input1 = document.createElement("input");
        input1.value = p[i].at;
        input1.setAttribute("class", "form-control text-primary");
        input1.setAttribute("style", "width:19% ;float:left;margin-left:25px;text-align:center;");
        input1.setAttribute("disabled", "disabled");
        input1.setAttribute("id", "at" + i);
        var input2 = document.createElement("input");
        input2.value = p[i].bt;
        input2.setAttribute("class", "form-control text-primary");
        input2.setAttribute("disabled", "disabled");
        input2.setAttribute("id", "bt" + i);
        input2.setAttribute("style", "width:30% ;float:left;margin-left:50px;text-align:center;");
        var btn = document.createElement("button");
        var text1 = document.createTextNode("EDIT");
        btn.appendChild(text1);
        btn.setAttribute("id", "btn" + i);
        btn.setAttribute("class", "btn btn-warning");
        btn.setAttribute("onclick", "edit(this.id)");
        btn.setAttribute("style", "float:left;margin-left:20px;");
        //btn.setAttribute("style", "float:right;margin-right:50px;");
        var br = document.createElement("br");
        card.appendChild(pid);
        //card.appendChild(pid);
        card.appendChild(input1);
        card.appendChild(input2);
        card.appendChild(btn);
        inp.appendChild(card);
        //inp.appendChild(br);
    }
}


function displayList1() {

    console.log(p1[0].at);
    var inp = document.getElementById("showinput1");
    //inp.setAttribute("style", "height:" + p.length * 80 + "px");
    inp.innerHTML = "";
    for (var i = 0; i < p1.length; i++) {
        var card = document.createElement("div");
        //card.setAttribute("class", "card");
        var pid = document.createElement("div");
        pid.textContent = "P" + (i + 1) + "    ";
        pid.setAttribute("style", "float:left;margin-left:20px;");
        //card.setAttribute("style", "float:left;");
        card.setAttribute("style", "width:800px;height: 50px;");
        var input1 = document.createElement("input");
        input1.value = p1[i].at;
        input1.setAttribute("class", "form-control text-primary");
        input1.setAttribute("style", "width:50px;float:left;margin-left:100px;text-align:center;");
        input1.setAttribute("disabled", "disabled");
        input1.setAttribute("id", "at" + i);
        var input2 = document.createElement("input");
        input2.value = p1[i].bt;
        input2.setAttribute("class", "form-control text-primary");
        input2.setAttribute("disabled", "disabled");
        input2.setAttribute("id", "bt" + i);
        input2.setAttribute("style", "width:50px;float:left;margin-left:100px;margin-right:100px;text-align:center;");
        var btn = document.createElement("button");
        var text1 = document.createTextNode("EDIT");
        btn.appendChild(text1);
        btn.setAttribute("id", "btn" + i);
        btn.setAttribute("class", "btn btn-warning");
        btn.setAttribute("onclick", "edit(this.id)");
        //btn.setAttribute("style", "float:right;margin-right:50px;");
        var br = document.createElement("br");
        card.appendChild(pid);
        //card.appendChild(pid);
        card.appendChild(input1);
        card.appendChild(input2);
        card.appendChild(btn);
        inp.appendChild(card);
        //inp.appendChild(br);
    }
}

function edit(id) {
    var pos = parseInt(id.substr(3));
    var button = document.getElementById(id);
    button.innerHTML = "SAVE";
    button.setAttribute("onclick", "save(" + pos + ")");
    document.getElementById("at" + pos).removeAttribute("disabled");
    document.getElementById("bt" + pos).removeAttribute("disabled");
}

function save(pos) {
    at = parseInt(document.getElementById("at" + pos).value);
    bt = document.getElementById("bt" + pos).value;
    if (isNaN(parseInt(at)) && isNaN(parseInt(bt))) {
        window.alert("Please enter valid inputs");
        return;
    }
    if (isNaN(parseInt(at))) {
        window.alert("Please enter valid inputs");
        return;
    }

    if (parseInt(at) < 0 ) {
        window.alert("Invalid inputs");
        return;
    }


    p[pos].at = at;
    p[pos].bt = bt;
    displayList();
}
