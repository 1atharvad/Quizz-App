function getCategory() {
    if (window.location.search.split('?').length > 1) {
        $.ajax({
            method: "GET",
            url: "http://localhost:3000/category",
            success: function(result) {
                $flag = 0;
                for (var $i=0; $i<result.length; $i++) {
                    if (result[$i].name === window.location.search.split('?')[1].split('=')[1]) {
                        getData(result[$i].name);
                        $flag = 1;
                        break;
                    }
                }
                if ($flag === 0) {
                    errorDisplay();
                }
            }
        });
    } else {
        errorDisplay();
    }
}

function getData(category) {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/" + category,
        success: function(result) {
            // If the category is found
            $(".error-card").hide();
            displayCategory(category, result.length);
            displayQuestions(category, result);
            addModalData(result);
            bottomNav(category);
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

function displayQuestions(category, data) {
    var $questionCard = $(".question-card").html();

    data.forEach(function(question, index) {
        // Creating the card dynamically
        $("section").append($questionCard.replace("question-id", "question-"+(index+1)));

        // For Card Display
        $("#question-" + (index+1) + " .card-title").html("Question " + (index+1));
        $("#question-" + (index+1) + " .card-text").html(question.question);

        // Button click for edit

        // Button click for delete
        $("#question-" + (index+1) + " #delete").on("click", function() {
            $("#deleteQuestion #delete").on("click", function() {
                deleteBtn_v2(category, index+1);
            });
        });
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
        // To get all the questions from database
        method: "GET",
        url: "http://localhost:3000/" + category,
        success: function(result) {
            var cnt = id;
            for (var $i=id; $i<result.length; $i++) {
                $.ajax({
                    // Shifting up the questions after deleting the element
                    method: "PUT",
                    url: "http://localhost:3000/" + category + "/" + $i,
                    data: result[$i],
                    success: function() {
                        cnt += 1;
                        if (cnt === result.length) {
                            // Actually deleting the last question after all shifting has been done
                            $.ajax({
                                method: "DELETE",
                                url: "http://localhost:3000/" + category + "/" + result.length,
                                success: function() {
                                    location.reload();
                                },
                                error: function() {
                                    location.reload();
                                }
                            });
                        }
                    }
                });
            }
            // Deleting the last element or the only element as it will not have any elements after it
            if (id === result.length) {
                $.ajax({
                    method: "DELETE",
                    url: "http://localhost:3000/" + category + "/" + result.length,
                    success: function() {
                        location.reload();
                    }
                });
            }
        },
        error: errorDisplay()
    });
}

function deleteBtn_v2(category, id) {
    $.ajax({
        // To get all the questions from database
        method: "GET",
        url: "http://localhost:3000/" + category,
        success: function(result) {
            update_id(category, result, id)
        },
        error: errorDisplay()
    });
}

function update_id(category, result, $i) {
    $.ajax({
        // Shifting up the questions after deleting the element
        method: "PUT",
        url: "http://localhost:3000/" + category + "/" + $i,
        data: result[$i],
        success: function() {
            //update_id(category, result, $i+1);
            console.log($i)
        },
        error: function() {
            console.log($i)
        }
    });
    if($i+1 <= result.length) {
        update_id(category, result, $i+1);
    }
}

function deleteAll(category) {
    $.ajax({
        // To get all the questions from database
        method: "GET",
        url: "http://localhost:3000/category",
        success: function(result) {
            console.log(result)
            for (var $i=1; $i<=result.length; $i++) {
                if (result[$i-1].name === category) {
                    console.log($i)
                    $.ajax({
                        method: "DELETE",
                        url: "http://localhost:3000/category/" + $i,
                        success: function() {
                            location.reload();
                        }
                    });
                    break;
                }
            }
        },
        error: errorDisplay()
    });
}

function bottomNav(category) {
    $(".nav-card #deleteAll").on("click", function() {
        $("#deleteQuestion #delete").on("click", function() {
            deleteAll(category);
        });
    });
}

getCategory();