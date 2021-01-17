let sessionEmail= sessionStorage.getItem("userid");
    
google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);

let categoryScores = [0, 0, 0, 0, 0, 0]; 
let dataSports = [['Date', 'Sports']];
let dataEntertainment = [['Date', 'Entertainment']];
let dataScience = [['Date', 'Science']];
let dataGK = [['Date', 'GK']];
let dataPFacts = [['Date', 'Programming Facts']];
let dataSpace = [['Date', 'Space']];

let f1=0, f2=0, f3=0, f4=0, f5=0, f6=0;
$.ajax({
    method: "GET",
    url: "http://localhost:3000/user",
    success: function(result) {
        result.forEach(function(data) {
            if(data.email === sessionEmail) {
                var $category = JSON.parse(data.category);
                let counter = 1;
                Object.keys($category).forEach(function(element){
                    $category[element].forEach(function(ct){
                        $('#table').append("<tr class='name'><td>"+counter+"</td><td>"+element+"</td><td>"+ct.score+"</td><td>"+ct.date+"</td></tr>")   ;  
                        counter += 1;
                        if(element === "Sports") {
                            categoryScores[0] += ct.score;
                            dataSports.push([ct.date, ct.score]);
                            f1+=1;
                        } else if (element === "Space") {
                            categoryScores[5] += ct.score;
                            dataSpace.push([ct.date, ct.score]);
                            f5++;
                        } else if (element === "Entertainment") {
                            categoryScores[1] += ct.score;
                            dataEntertainment.push([ct.date, ct.score]);
                            f1++;
                        } else if (element === "Science") {
                            categoryScores[2]+=ct.score;
                            dataScience.push([ct.date, ct.score]);
                            f2++;
                        } else if (element === "GK") {
                            categoryScores[3] += ct.score;
                            dataGK.push([ct.date, ct.score]);
                            f3++;
                        } else {
                            categoryScores[4] += ct.score;
                            dataPFacts.push([ct.date, ct.score]);
                            f4++;
                        }
                    });
                });
            }
        });
        drawlinechart(dataSports, 1);
        drawlinechart(dataSpace, 2);
        drawlinechart(dataEntertainment, 3);
        drawlinechart(dataScience, 4);
        drawlinechart(dataGK, 5);
        drawlinechart(dataPFacts, 6);
    }
});

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Category', 'Score'],
        ['Sports', categoryScores[0]],
        ['Entertainment', categoryScores[1]],
        ['Science', categoryScores[2]],
        ['GK', categoryScores[3]],
        ['Programming Facts', categoryScores[4]],
        ['Space', categoryScores[5]]
    ]);
    var options = {
        title: 'Score PieChart'
    };
    var chart = new google.visualization.PieChart(document.getElementById("piechart"));
    chart.draw(data, options);
}

function drawlinechart(category, id){
    if(category.length !== 1){
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(function() {
            let data = google.visualization.arrayToDataTable(category);
            var options = {
                title: 'User Performance',
                legend: { position: 'bottom' }
            };
            var chart = new google.visualization.LineChart(document.getElementById('curve_chart' + id));
            chart.draw(data, options);
        });
    } else {
        $("#curve_chart" + id).hide();
    }
}