var jsonData = $.ajax({
    url: "/planname/" + window.localStorage.getItem("user"),
    dataType: "json",
    async: false
}).responseText;

var result = $.parseJSON(jsonData);
console.log(result);

var chart = document.getElementById("lineChart");
console.log(chart);

function getFields(input, field) {
    var output = [];
    for (var i = 0; i < input.length; ++i)
        output.push(input[i][field]);
    return output;
}

function strTochart(input) {
    var output = [];
    for (var i = 0; i < input.length; ++i)
        output.push(parseInt(input[i]));
    return output;
}

var strAmounts = getFields(result, "amount");
var amount = strTochart(strAmounts);
console.log(amount);


var planName = getFields(result, "plan_name");
console.log(planName);




new Chart(document.getElementById("chart"), {
    type: 'doughnut',
    data: {
       
      //  labels: planName,
        datasets: [{
            //label: "Population (millions)",
            backgroundColor: ["#0c223d", "#e32525", "#22364e", "#1a936f", "#3e4b5b"],
            data: amount
        }]
    },
    options: {
         cutoutPercentage: 70
    //     percentageInnerCutout: 5
    //     // title: {
    //     //     //display: false,
    //     //     percentageInnerCutout: 10,
    //     //     //text: 'Savings Plan'
    //     // }
     }
});