var currentQuestion = 0;
var correctAnswers = 0;
var quizOver = false;
var iSelectedAnswer = [];
var qlength = 0;
var c = 10 * 60;
var t;
var category_name;
var questions = [];

$(document).ready(function () {
  category_name = window.location.search.split("?")[1].split("=")[1];
  $(this).find(".preButton").attr("disabled", "disabled");
  clickEvent(category_name);
  $(".quizContainer").show();
  timedCount();
  hideScore();

  //Ajax method to get json data
  function clickEvent(id) {
    $.ajax({
      method: "GET",
      url: " http://localhost:3000/" + id,
      success: function (x) {
       x.forEach((items) => {
          questions.push(items);
        });
        qlength = questions.length;
      },
      complete: function () {
        displayCurrentQuestion(currentQuestion);
      }
    });
  }

  // previous Question button
  $(this)
    .find(".preButton")
    .on("click", function () {
      if (!quizOver) {
        if (currentQuestion === 1) {
          $(".preButton").attr("disabled", "disabled");
        }
        if (currentQuestion + 2 !== qlength) {
          $(".nextButton").prop("disabled", false);
        }

        currentQuestion--;
        if (currentQuestion < questions.length) {
          displayCurrentQuestion(currentQuestion);
        }
      }
      if ($(".preButton").text() === "View Answer") {
        currentQuestion = 0;
        $(".question").text("");
        $(".choiceList").hide();
        viewResults();
      }
    });

  // Next Question button
  $(this)
    .find(".nextButton")
    .on("click", function () {
      if (!quizOver) {
        if (currentQuestion + 2 === qlength) {
          $(".nextButton").prop("disabled", true);
        }

        currentQuestion++;
        if (currentQuestion >= 1) {
          $(".preButton").prop("disabled", false);
        }

        if (currentQuestion < questions.length) {
          displayCurrentQuestion(currentQuestion);
        } 
      }
    });

  //update correct answers after select choice
  $(document).on("click", ".quizContainer > .choiceList ", function () {
    var val = $("input[type='radio']:checked").val();
    if (val === questions[currentQuestion].correct_option) {
      correctAnswers++;
    }

    iSelectedAnswer[currentQuestion] = val;
  });

// submit button
  $(".submitbtn").click(function () {
    quizComplete();
  });
});

function quizComplete(){
  displayScore();
  $(".image").hide();
    $(".question").hide();
    $(".choiceList").hide();
    $(document).find(".preButton").text("View Answer");
    $(".preButton").prop("disabled", false);
    $(".submit").hide();
    $("#timer").hide();
   $(".nextButton").hide();
    quizOver = true;
    return false;
}

// update time
function timedCount() {
  var hours = parseInt(c / 3600) % 24;
  var minutes = parseInt(c / 60) % 60;
  var seconds = c % 60;
  var result =
    (hours < 10 ? "0" + hours : hours) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds);
  $("#timer").html(result);

  if (c === 0) {
    quizComplete();
  }

  c = c - 1;
  t = setTimeout(function () {
    timedCount();
  }, 1000);
}

// Display question
function displayCurrentQuestion(currentQuestion) {
 
 var question = questions[currentQuestion].question;
 var img_url=questions[currentQuestion].image_url;
// console.log(img_url.length);
 var choiceList = $(document).find(".quizContainer > .choiceList");
  var questionClass = $(document).find(".quizContainer > .question");
  $(questionClass).text(currentQuestion + 1 + " . " + question);
  if(img_url.length>0){
    $(".image").show();
    $(".image").attr("src","./images/"+img_url)
  }
  else{
    $(".image").hide();
  }
   $(choiceList).find("li").remove();
  let choice1 = [];
  var option_1 = questions[currentQuestion].option_1;
  var option_2 = questions[currentQuestion].option_2;
  var option_3 = questions[currentQuestion].option_3;
  var option_4 = questions[currentQuestion].option_4;
  choice1.push(option_1);
  choice1.push(option_2);
  choice1.push(option_3);
  choice1.push(option_4);

  for (var i = 0; i < 4; i++) {
    $(
      '<li><input type="radio" class="radio-inline" value=' +
        (i + 1) +
        ' name="dynradio" />' +
        " " +
        choice1[i] +
        "</li>"
    ).appendTo(choiceList);
  }
}

// view result
function viewResults() {
  if (currentQuestion === 10) {
    currentQuestion = 0;
    return false;
  }

  $("#timer").hide();
  $(".question").show();
  $(".preButton").hide();
    hideScore();
  for (var j = 0; j < qlength; j++) {
    var question = questions[currentQuestion].question;
    choice = [];
    var option_1 = questions[currentQuestion].option_1;
    var option_2 = questions[currentQuestion].option_2;
    var option_3 = questions[currentQuestion].option_3;
    var option_4 = questions[currentQuestion].option_4;
    choice.push(option_1);
    choice.push(option_2);
    choice.push(option_3);
    choice.push(option_4);

    $(".question").append(
      "<div>" + question + '</div><ul id="result_ul" style="list-style:none;">'
    );
    for (var i = 0; i < 4; i++) {
      if (parseInt(iSelectedAnswer[currentQuestion]) === i + 1) {
        if (parseInt(questions[currentQuestion].correct_option) === i + 1) {
          $(".question").append(
            '<li style="border:2px solid green;margin-top:10px;">' +
              " " +
              choice[i] +
              "</li>"
          );
        } else {
          $(".question").append(
            '<li style="border:2px solid red;margin-top:10px;">' +
              " " +
              choice[i] +
              "</li>"
          );
        }
      } else {
        if (parseInt(questions[currentQuestion].correct_option) === i + 1) {
          $(".question").append(
            '<li style="border:2px solid green;margin-top:10px;">' +
              " " +
              choice[i] +
              "</li>"
          );
        } else {
          $(".question").append("<li>" + " " + choice[i] + "</li>");
        }
      }
    }

    $(".question").append("</ul><hr>");
    currentQuestion++;
  }
  $(".question").append("<button class='question_close'>Close</button");
}

//show score after submit 
function displayScore() {
  $(document)
    .find(".quizContainer > .result")
    .text("You scored: " + correctAnswers + " out of: " + questions.length);
  $(document).find(".quizContainer > .result").show();
}

//hide score
function hideScore() {
  $(document).find(".result").hide();
}

//post score data in user array of json

$(document).on("click", ".question_close", function (e) {
  var email = sessionStorage.getItem("userid");

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "/" + mm + "/" + yyyy;
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/user",
    success: function (result) {
      result.forEach(function (userData) {
        if (email === userData.email) {
          var $categoryData = JSON.parse(userData.category);

          if ($categoryData[category_name] === undefined) {
            $categoryData[category_name] = [];
          }
           $categoryData[category_name][$categoryData[category_name].length] = {
            score: correctAnswers,
            date: today,
          };
          userData["category"] = JSON.stringify($categoryData);
          $.ajax({
            method: "PUT",
            url: "http://localhost:3000/user/" + userData.id,
            data: userData,
          });
        }
      });
    },
    complete: () => {
      location.href = "./";
    },
  });
  e.preventDefault();
});
