const p = [];
// var index = 1;
var list=document.getElementById("list").value;
function solve(){
    list=JSON.parse(list);
    list.forEach(e => { 
        p.push({
            "at":e.studentID,
            "bt":e.fname,
            "dt":0
        })
    });
    displayList();
}
solve();

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
        input2.setAttribute("style", "width:30% ;float:left;margin-left:50px;text-align:center;");

        var input3 = document.createElement("input");
        input3.value =0;
        // input3.setAttribute("class", "form-control text-primary");
        input3.setAttribute("hidden", "true");
        input3.setAttribute("id", "dt" + i);
        // input3.setAttribute("style", "width:15% ;float:left;margin-left:50px;text-align:center;");

        var btn = document.createElement("button");
        var text1 = document.createTextNode("ADD");
        btn.appendChild(text1);
        btn.setAttribute("id", "btn" + i);
        btn.setAttribute("class", "btn btn-warning");
        btn.setAttribute("onclick", "func(this.id)");
        btn.setAttribute("style", "float:left;margin-left:20px;");
        //btn.setAttribute("style", "float:right;margin-right:50px;");
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
function func(id){
    console.log(id);
    var pos = parseInt(id.substr(3));
    var button = document.getElementById(id);
    button.innerHTML = "REMOVE";
    p[pos].dt=1;
    button.setAttribute("onclick", "remove("+pos+")");
}
function remove(pos){
    // console.log(pos);
    p[pos].dt=0;
    var button = document.getElementById("btn"+pos);
    button.innerHTML = "ADD";
    var c="func(btn"+pos+")";
    // console.log(c);
    button.setAttribute("onclick","func(this.id)");
}
function saveChanges(){

    document.getElementById('sends').value=JSON.stringify(p);
    document.getElementById("cls").value=document.getElementById("cv").value;
    console.log(JSON.stringify(p));
}
