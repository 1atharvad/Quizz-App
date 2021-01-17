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
            $(".nav-card").show();
            displayCategory(category, result.length);
            displayQuestions(category, result);
            addDisplayModal(result);
            bottomNav(category);
        },
        error: errorDisplay()
    });
}

function errorDisplay() {
    // If the category is not found
    displayCategory("Category-Not-Found", 0);
    $(".nav-card").hide();
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
        $("#question-" + (index+1) + " #update").on("click", function() {
            updateDisplay(question, index+1);

            // When clicked on save button
            $("#updateModal #editQuestion").on("click", function() {
                updateEdit(category, index+1);
            });
        });
       
        // Button click for delete
        $("#question-" + (index+1) + " #delete").on("click", function() {
            // When clicked on delete button of the modal
            $("#deleteModal #delete").on("click", function() {
                deleteBtn(category, index+1);
            });
        });
    });
    
}

function addDisplayModal(data) {
    data.forEach(function(question, index) {
        $("#question-" + (index+1)).on("click", function() {
            // For Modal Display
            $("#displayModal .modal-title").html("Question " + (index+1));

            // For displaying image
            if (question.image_url !== "") {
                $("#displayModal .image").show();
                $("#displayModal .image").attr("src", "./images/" + question.image_url);
            } else {
                $("#displayModal .image").hide();
            }

            // For displaying the image
            $("#displayModal .modal-question").html(question.question);

            // For option 1
            $("#displayModal #option_1").html(question.option_1);

            // For option 2
            $("#displayModal #option_2").html(question.option_2);

            // For option 3
            $("#displayModal #option_3").html(question.option_3);

            // For option 4
            $("#displayModal #option_4").html(question.option_4);
           
            for (var $i=1; $i<=4; $i++) {
                // To remove the previously added option classes
                // If no option class do not remove any class
                $("#displayModal #option_" + $i).removeClass(function() {
                    var $class = $(this).attr("class").split(" ").pop();
                    if ($class === "correct-option" || $class === "modal-option") {
                        return $class;
                    } else {
                        return "";
                    }
                });

                // To add the classes for options
                if ($i === parseInt(question.correct_option)) {
                    $("#displayModal #option_" + $i).addClass("correct-option");
                } else {
                    $("#displayModal #option_" + $i).addClass("modal-option");
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
//Validation of the inputs in specific modals
function validateInput(modal)
{
    var $isValid=true;
    var $components = ["question", "option_1", "option_2", "option_3", "option_4"];

    $components.forEach(function(attribute) {
        // To remove valid ar invalid class names
        $("#" + modal + " #" + attribute).removeClass(function() {
            var $class = $(this).attr("class").split(" ").pop();
            if ($class === "is-valid" || $class === "is-invalid") {
                return $class;
            } else {
                return "";
            }
        });

        //Adding valid or invalid class depending upon the input values
        if($("#" + modal + " #" + attribute).val() === "") {
            $isValid = false;
            $("#" + modal + " #" + attribute).addClass("is-invalid");
        } else {
            $("#" + modal + " #" + attribute).addClass("is-valid");
        }
    });
    return $isValid;
}

// Adding a new question
function addQuestion(category) {
    $("#addQuestion").click(function() { 
        if (validateInput("addModal")) {
            $.ajax({
                url: "http://localhost:3000/" + category,
                type: "POST",
                data: { 
                    "question": $("#addModal #question").val(),
                    "option_1": $("#addModal #option_1").val(),
                    "option_2": $("#addModal #option_2").val(),
                    "option_3": $("#addModal #option_3").val(),
                    "option_4": $("#addModal #option_4").val(),
                    "correct_option": $("#addModal #correctOption").val(),
                    "image_url":$("#addModal #customFile").val()
                },
                success: function (data) {
                    location.reload();    
                }
            });
        }
    });  
}

function updateDisplay(question, id)
{
    $("#updateModal #question_no").html("Edit Question " + id)
    $("#updateModal #question").val(question.question),
    $("#updateModal #option_1").val(question.option_1),
    $("#updateModal #option_2").val(question.option_2),
    $("#updateModal #option_3").val(question.option_3),
    $("#updateModal #option_4").val(question.option_4),
    $("#updateModal #correctOption").val(question.correct_option),
    $("#updateModal #customFile").val(question.image_url)
}

// Edit the question
function updateEdit(category, id) {
    if (validateInput("updateModal")) {
        $.ajax({
            url: "http://localhost:3000/" + category + "/" + id,
            type: "PATCH",
            data: { 
                "question": $("#updateModal #question").val(),
                "option_1": $("#updateModal #option_1").val(),
                "option_2": $("#updateModal #option_2").val(),
                "option_3": $("#updateModal #option_3").val(),
                "option_4": $("#updateModal #option_4").val(),
                "correct_option": $("#updateModal #correctOption").val(),
                "image_url":$("#updateModal #customFile").val()
            },
            success: function () {
                location.reload();
            }
        });
    }
}

// Nav bar for add new question 
function bottomNav(category) {
    addQuestion(category); 
}

// Start
getCategory();