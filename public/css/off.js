var state_name=document.getElementById("state_name").value;
var schools=document.getElementById("schools").value;
schools=JSON.parse(schools);

let auth_token;
$(document).ready( function(){
            $.ajax({
                type:'get',
                url:'https://www.universal-tutorial.com/api/getaccesstoken',
                success:function(data){
                    auth_token=data.auth_token;
                    getCountry(data.auth_token);
                    console.log('ajax');
                },
                error:function(error){
                    console.log(error);
                },
                headers:{
                    "Accept": "application/json",
                    "api-token": "Y4iA6bE_Bep9tMA6Xq1Fjkem-h0I6yQ1Twbu0FplS4oDCHpHunYXVPOFM_OB5_wWKqo",
                    "user-email": "balkar81199@gmail.com"
                }

            })
            // $('#f1').onload(function(){
            //     getState();
            // });
            console.log('hello');
})
function getCountry(auth_token){
            $.ajax({
                type:'get',
                url:'https://www.universal-tutorial.com/api/countries/',
                success:function(data){
                    // console.log(data);
                    getState(auth_token);
                    console.log('ajax');
                },
                error:function(error){
                    console.log(error);
                },
                headers:{
                    "Authorization": "Bearer " +auth_token,
                    "Accept": "application/json"
                }
            })
}

function getState(){
            $.ajax({
                type:'get',
                url:'https://www.universal-tutorial.com/api/states/India',
                success:function(data){
                    // $('#state').empty();
                    // console.log(data);
                    getCity(auth_token);
                    console.log('ajax');
                },
                error:function(error){
                    console.log(error);
                },
                headers:{
                    "Authorization": "Bearer " +auth_token,
                    "Accept": "application/json"
                }

            })
}



function getCity(){
            $.ajax({
                type:'get',
                url:'https://www.universal-tutorial.com/api/cities/'+state_name,
                success:function(data){
                    $('#f1').empty();
                    $('#f1').append('<option value="all">All</option>');
                    data.forEach(element=>{
                        $('#f1').append( '<option value="'+element.city_name+ '">'+element.city_name+'</option>' );
                    })
                   console.log('ajax');
                },
                error:function(error){
                    console.log(error);
                },
                headers:{
                    "Authorization": "Bearer " +auth_token,
                    "Accept": "application/json"
                }

            })
}

function f1(){
    var city=document.getElementById('f1').value;
    console.log(schools[city]);
    $('#f2').empty();
    $('#f2').append('<option value="all">All</option>');
    schools[city].forEach(element=>{
        $('#f2').append( '<option value="'+element+ '">'+element+'</option>' );
    })
}


var xValues = [50,60,70,80,90,100,110,120,130,140,150];
var yValues = [7,8,8,9,9,9,10,11,14,14,15];
console.log(xValues);
new Chart("myChart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues
        }]
      },
      options: {
        legend: {display: false},
        scales: {
          yAxes: [{ticks: {min: 0, max:20}}],
        }
      }
});