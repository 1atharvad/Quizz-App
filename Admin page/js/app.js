function getCategory() {
    if (window.location.search.split('?').length > 1) {
        return window.location.search.split('?')[1].split('=')[1];
    } else {
        return "";
    }
}

function getData(category) {
    if (category === "") {
        errorDisplay();
        return;
    }
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/" + category,
        success: function(result) {
            // If the category is found
            $(".error-card").hide();
            displayCategory(category, result.length);
            displayQuestions(result);
            addModalData(result);
        },
        error: errorDisplay()
    });
}

function errorDisplay() {
    // If the category is not found
    displayCategory("Category-Not-Found", 0);
}

function displayCategory(name, size) {
    $(".jumbotron h1").html(name.replace(/\-/g, " "));
    $(".jumbotron p").html(size + " Questions");
}

function displayQuestions(data) {
    var $questionCard = $(".question-card").html();

    data.forEach(function(question, index) {
        // Creating the card dynamically
        $("section").append($questionCard.replace("question-id", "question-"+(index+1)));

        // For Card Display
        $("#question-" + (index+1) + " .card-title").html("Question " + (index+1));
        $("#question-" + (index+1) + " .card-text").html(question.question);
    });
    
}

function addModalData(data) {
    data.forEach(function(question, index) {
        $("#question-" + (index+1)).on("click", function() {
            // For Modal Display
            $("#question .modal-title").html("Question " + (index+1));
            $("#question .modal-question").html(question.question);

            // For option 1
            $("#question #option_1").html(question.option_1);

            // For option 2
            $("#question #option_2").html(question.option_2);

            // For option 3
            $("#question #option_3").html(question.option_3);

            // For option 4
            $("#question #option_4").html(question.option_4);
           
            console.log(question.correct_option)
            for (var $i=1; $i<=4; $i++) {
                // To remove the previously added option classes
                // If no option class do not remove any class
                $("#question #option_" + $i).removeClass(function() {
                    var $class = $(this).attr("class").split(" ").pop();
                    if ($class === "correct-option" || $class === "modal-option") {
                        return $class;
                    } else {
                        return "";
                    }
                });

                // To add the classes for options
                if ($i == question.correct_option) {
                    $("#question #option_" + $i).addClass("correct-option");
                } else {
                    $("#question #option_" + $i).addClass("modal-option");
                }
            }
        });   
    });
}

function deleteBtn(category, id) {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/" + category,
        success: function(result) {
            for (var $i=id; $i<result.length; $i++) {
                console.log(result[$i])
                $.ajax({
                    method: "PUT",
                    url: "http://localhost:3000/" + category + "/" + ($i),
                    data: result[$i],
                    success: function(result) {
                        console.log(result);
                    }
                });
            }
        },
        error: errorDisplay()
    });
    for (var $i=1; $i<=size; $i++) {
        $(".question-" + $i + " button#update").on("click", function() {
            console.log($i+"button")
        });
    }
}

getData(getCategory());
//deleteBtn(getCategory(), 1);