$(document).ready(function() {
 
    $('#retrieve-resources').click(function() {
        var displayResources = $('#display-resources');
        
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/Harry-Potter",
            success: function(result) {
                console.log(result);
                var output="<table><thead><tr><th>Name</th><th>Email</th></thead><tbody>";
                for (var i in result) {
                    output+="<tr><td>" + result[i].name + "</td><td>" + result[i].email + "</td></tr>";
                }
                output+="</tbody></table>";
                
                displayResources.html(output);
                $("table").addClass("table");
            }
        });
    });

    $("#add-resources").click(function() {
        $.ajax({
            method:'POST',
            url: "http://localhost:3000/Harry-Potter",
            data: {
                "question": "In 2007, Voyager 2 crossed the heliosheath boundary and into the vast region at the edge of our solar system where the solar wind runs up against the thin gas between the stars. What did this crossing confirm about the shape of our solar system?",
                "option_1": "It’s round",
                "option_2": "It’s squashed",
                "option_3": "It’s like a donut",
                "option_4": "It’s a horseshoe shape",
                "correct_option": 2
            },
            success: function(result) {
                console.log(result); 
            }}
        );
    });

    $("#delete-resources").click(function() {
        $.ajax({
            method:'DELETE',
            url: "http://localhost:3000/Harry-Potter/1",
            success: function(result) {
                console.log(result); 
                $.ajax({
                    method: "PUT",
                    url: "http://localhost:3000/Harry-Potter/1",
                    data: {
                        "hello": "bye",
                    },
                    success: function(result) {
                        console.log(result);
                    }
                });
            }}
        );
    });
});