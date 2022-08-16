const p = [];
var index = 1;

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
    var currentdate = new Date();
    var datetime =  currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + "  "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds();
    p.push({
        "at": parseInt(at),
        "bt": bt,
        "ct":datetime
    });

    index = index + 1;
    displayList();
    document.getElementById("newat").value = "";
    document.getElementById("newbt").value = "";
    document.getElementById("newct").value = "";
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
        input1.setAttribute("style", "width:15% ;float:left;margin-left:25px;text-align:center;");
        input1.setAttribute("disabled", "disabled");
        input1.setAttribute("id", "at" + i);
        var input2 = document.createElement("input");
        input2.value = p[i].bt;
        input2.setAttribute("class", "form-control text-primary");
        input2.setAttribute("disabled", "disabled");
        input2.setAttribute("id", "bt" + i);
        input2.setAttribute("style", "width:28% ;float:left;margin-left:50px;text-align:center;");

        var input3 = document.createElement("input");
        input3.value = p[i].ct;
        input3.setAttribute("class", "form-control text-primary");
        input3.setAttribute("style", "width:19% ;float:left;margin-left:65px;text-align:center;");
        input3.setAttribute("disabled", "disabled");
        input3.setAttribute("id", "ct" + i);
        input3.setAttribute("style", "width:30% ;float:left;margin-left:25px;text-align:center;");


        var btn = document.createElement("button");
        var text1 = document.createTextNode("EDIT");
        btn.appendChild(text1);
        btn.setAttribute("id", "btn" + i);
        btn.setAttribute("class", "btn btn-warning");
        btn.setAttribute("onclick", "edit(this.id)");
        // btn.setAttribute("style", "float:left;margin-left:20px;");
        btn.setAttribute("style", "float:right;margin-right:5px;");
        var br = document.createElement("br");
        card.appendChild(pid);
        //card.appendChild(pid);
        card.appendChild(input1);
        card.appendChild(input2);
        card.appendChild(input3);
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
    document.getElementById("ct" + pos).removeAttribute("disabled");
}

function save(pos) {
    at = parseInt(document.getElementById("at" + pos).value);
    bt = document.getElementById("bt" + pos).value;
    ct = document.getElementById("ct" + pos).value;
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
    p[pos].ct = ct;
    displayList();
}

function saveChanges(){
    document.getElementById('hid').value=JSON.stringify(p);
    // console.log("hii");
    p=[];
    console.log(JSON.stringify(p));
}
