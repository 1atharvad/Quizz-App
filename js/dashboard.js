let sessionemail= sessionStorage.getItem("userid");

$('.username').html(sessionStorage.getItem('username'));
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    let categoryscores = [0,0,0,0,0,0]; 
   
    //Bar Data
    let bardata=([
    ['Date', 'Sports', 'Entertainment', 'Science', 'GK', 'Programming Facts', 'Space'],
    ]);
    
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/user",
        success: function(result) {
            result.forEach(function(data) {
            if(data.email === sessionemail )
            { 
                var $category = JSON.parse(data.category);               
                let counter=1;
                Object.keys($category).forEach(function(element){               
                $category[element].forEach(function(ct){                  
                counter+=1;
                if(element=== "Sports")
                {
                    categoryscores[0]+=ct.score;
                    var d1=[ct.date, ct.score, null,null,null,null,null];
                    bardata.push(d1);
                    
                }
                else if (element === "Entertainment")
                {
                    categoryscores[1]+=ct.score;
                    var d2=[ct.date, null, ct.score, null,null,null,null];
                    bardata.push(d2);
                    
                }
                else if (element === "Science"){
                    categoryscores[2]+=ct.score;
                    var d3=[ct.date, null,null, ct.score, null,null,null];
                    bardata.push(d3);
                
                }
                else if (element === "GK"){
                    categoryscores[3]+=ct.score;
                    var d4=[ct.date,  null,null,null, ct.score, null,null];
                    bardata.push(d4);
                    
                }
                else if (element === "Programming Facts"){
                    categoryscores[4]+=ct.score;
                    var d5=[ct.date, null,null,null,null, ct.score,null];
                    bardata.push(d5);
                    
                }
                else{
                    categoryscores[5]+=ct.score;
                    var d6=[ct.date, null,null,null,null,null, ct.score];
                    bardata.push(d6);
                
                }
                })               
                })              
            }
            });   
            google.charts.load('current', {'packages':['bar']});
            google.charts.setOnLoadCallback(drawBarChart);
        }
    });

//Pie chart 
    function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Category', 'Score'],
        ['Sports',     categoryscores[0]],
        ['Entertainment',      categoryscores[1]],
        ['Science',  categoryscores[2]],
        ['GK', categoryscores[3]],
        ['Programming Facts',    categoryscores[4]],
        ['Space', categoryscores[5]]
    ]);
    var options = {
        title: 'Score PieChart'
    };
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
    }
   
//BAR GRAPH
    function drawBarChart() {
    var data = google.visualization.arrayToDataTable(bardata);
    var options = {
        chart: {
        title: 'User Performance',
        label: 'Date'
        }
    };
    var chart = new google.charts.Bar(document.getElementById('bargraph'));  
    chart.draw(data, options);
    } 

function displayCards(categoryData){
    var $card = $("#card-templete").html();
    categoryData.forEach((category) => {
        $("#category.container .row").append($card.replace("card_id", "card_"+category.id).replace("category-name", category.name));
        
        // Adding data and image to the card for specific category
        $("#card_" + category.id + " .card-text").text(category.name);
        $("#card_" + category.id + " #card-category").css("background-image", `linear-gradient(rgba(1,1,1,0.3), rgba(1,1,1,0.3)),url('../images/${category.image_url}')`);
    });
}

function categoryData(category) {
    getCategoryData(category);
    $('scoremodal').modal('show');
}

$('#scoremodal').on('hidden.bs.modal', function () {
    $('#table tr').remove();
    $('#thead th').remove();
})


function getCategoryData(category){
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/user",
        success: function(result) {
            let flag=0;
            result.forEach(function(data) {
            if(data.email === sessionemail ) {           
                var $category = JSON.parse(data.category);      
                let counter=1;
                Object.keys($category).forEach(function(element) {   
                    $category[element].forEach(function(ct) {           
                        if(element === category) {
                            flag=1;
                            if(counter===1)
                                $('#thead').append(" <th>ID</th><th>Score</th><th>Date</th>");
                            $('#table').append("<tr class='name'><td>"+counter+"</td><td>"+ct.score+"</td><td>"+ct.date+"</td></tr>")   ;  
                            counter+=1;
                        }
                    });
                });
            }
            if (flag===0) { 
                $('.emptyCase').show();
            } else
                $('.emptyCase').hide();
            });
        }
    });
}

function getCategory() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/category",
        success: function(result) {
            // Getting all categor data and displaying on the homepage
            displayCards(result);
        }
    });
}

getCategory();