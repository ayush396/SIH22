document.getElementById('buttons').addEventListener("click", function() {
    document.querySelector('.container').style.display = "flex";
    document.querySelector('.container1').style.display = "none";
    document.querySelector('main').style.opacity = "0.2"
    document.querySelector('.navbar').style.opacity = "0.2"
    document.querySelector('.header').style.opacity = "0.2"
});

document.querySelector('.close').addEventListener("click", function() {
    document.querySelector('.container').style.display = "none";
    document.querySelector('main').style.opacity = "1"
    document.querySelector('.navbar').style.opacity = "1"
    document.querySelector('.header').style.opacity = "1"
});

document.getElementById('change_p').addEventListener("click", function() {
    document.querySelector('.container1').style.display = "flex";
    document.querySelector('.container').style.display = "none";
    document.querySelector('main').style.opacity = "0.2"
    document.querySelector('.navbar').style.opacity = "0.2"
    document.querySelector('.header').style.opacity = "0.2"
});

document.querySelector('.close1').addEventListener("click", function() {
    document.querySelector('.container1').style.display = "none";
    document.querySelector('main').style.opacity = "1"
    document.querySelector('.navbar').style.opacity = "1"
    document.querySelector('.header').style.opacity = "1"
});



var xArray = ["Shapes", "Characters", "Vehicles", "Animals", "Fruits and vegetables"];
var yArray = [500, 49, 44, 24, 15];
var layout = { title: "Types of Submissions" };
var data = [{ labels: xArray, values: yArray, hole: .4, type: "pie" }];
Plotly.newPlot("pie", data, layout);



var yArray = [5, 6, 7, 0, 9, 10, 11, 1, 13, 4, 15, 0, 0, 0, 0, 0, 5, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var xArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
var data = [{
    x: xArray,
    y: yArray,
    mode: "lines"
}];
var layout = {
    xaxis: { range: [0, 30], title: "Days" },
    yaxis: { range: [0, 25], title: "Number of Correct Submissions" },
    title: "Performance This Month"
};

Plotly.newPlot("line", data, layout);