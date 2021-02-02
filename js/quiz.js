var selectedOptions = {};

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
					//errorDisplay();
				}
			}
		});
	} else {
		//errorDisplay();
	}
}

function getData(category) {
	$.ajax({
		method: "GET",
		url: "http://localhost:3000/" + category,
		success: function(result) {
			// If the category is found
			$("#quiz-name").text(category);
			navButtons(result);
			startQuiz(result);
		}
	});
}

function navButtons(questions) {
	console.log(questions)
    
}

function questionEvent(id, questions) {
	// Handling the previous button
	if (id === 0) {
		$(".previousBtn").prop("disabled", true);
	} else {
		$(".previousBtn").prop("disabled", false);
	}

	// Handling the next button
	if (id === questions.length-1){
		$(".nextBtn").prop("disabled", true);
	} else {
		$(".nextBtn").prop("disabled", false);
	}
	
	// To display the questions and options
	displayQuestion(questions[id]);
	return id;
}

function startQuiz(questions) {
	var questionId = 0;

	// Hide result and score sections
	$("#score-card").hide();
	$("#display-result").hide();

	// To start the time and assigning 1 minute per question
	startTimer(60*questions.length, questions);
	questionEvent(questionId, questions);

	// For previous button click
	$(".previousBtn").on("click", () => {
		questionId = questionEvent(questionId-1, questions);
	});

	// For next button click
	$(".nextBtn").on("click", () => {
		questionId = questionEvent(questionId+1, questions);
	});

	for (var i=1; i<=questions.length; i++) {
		$(".questionNav #questionNo").append(`<button type="button" class="btn btn-light" id="${i}">${i}</button>`);
	  	$(`.questionNav #questionNo #${i}`).on("click", function() {
			questionId = questionEvent($(this).attr('id')-1, questions);
		});
	}

	// Button click for all the options of the question
	var options = 4;
	for (var i=1; i<=options; i++) {
		$(`#quiz-question #option_${i}`).on("click", function() {
			var option = $(this).attr('id').split("option_")[1];
			selectedOptions[questionId+1] = option;
			queryOption(option);
			queryQuestion(questionId+1);
		});
	}
}

function startTimer(time, questions) {
	// Executes the function every one second and decrements the timer by one second.
	var timer = setInterval(() => {
		var hours = parseInt(time/3600) % 24;
		var minutes = parseInt(time/60) % 60;
		var seconds = time % 60;

		$("#quiz-question #timer").html(`${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
		
		// When timer is over stop the timer and exit
		if (time === 0) {
			clearInterval(timer);
			viewScore(calculateScore(questions), questions);
		}
		time--;
	}, 1000);

	// When the submit button is clicked the timer stops
	$("#submitModal #submitTest").on("click", () => {
		clearInterval(timer);
		viewScore(calculateScore(questions), questions);
	});
}

function displayQuestion(question) {
	// To display the question
	$("#quiz-question .question").text(`${question.id}. ${question.question}`);

	// To check the availability of image and then display it accordingly
	if (question.image_url !== ""){
		$("#quiz-question img").show();
		$("#quiz-question img").attr("src", `./images/${question.image_url}`);
	} else {
		$("#quiz-question img").hide();
	}

	// Selects the user choice if choosen else clears the option board
	queryOption(selectedOptions[question.id]);

	// To display the options
	var options = 4;
	for (var i=1; i<=options; i++) {
		$(`#quiz-question #option_${i}`).text(question[`option_${i}`]);
	}
}

// To handle the option button click functionalities
function queryOption(option) {
	var options = 4;
	for (var i=1; i<=options; i++) {
		// To remove the previously added choice option class
        // If no choice option class, do not remove any class
		$(`#quiz-question #option_${i}`).removeClass(function() {
			var $class = $(this).attr("class").split(" ").pop();
			if ($class === "option-choice") {
				return $class;
			} else {
				return "";
			}
		});
	}

	// If any option is selected then add class for showing the selected option
	if (option !== undefined) {
		$(`#quiz-question #option_${option}`).addClass("option-choice");
	}
}


// If an option is choosen of a question, then that question in the nav bar is highligted
// with blue color
function queryQuestion(id) {
	$(`#questionNo #${id}`).removeClass(function() {
		var $class = $(this).attr("class").split(" ").pop();
		if ($class === "btn-light") {
			$(`#questionNo #${id}`).addClass("btn-info");
			return $class;
		} else {
			return "";
		}
	});
}

// Calculates the score based on the the options selected by the user
function calculateScore(questions) {
	var score = 0;
	Object.keys(selectedOptions).forEach((questionId) => {
		if (questions[questionId-1].correct_option === selectedOptions[questionId]) {
			score += 1;
		}
	});
	return score;
}

// To view the result of that quiz and images to mock the user depending upon the score
function viewScore(score, questions) {
	// Hide the quiz and display only score card
	$("#quiz-page").hide();
	$("#score-card").show();

	var grade = questions.length/10;
	if (score === 0){
		$(".box_image img").attr("src", "./images/shocked.png");
	} else if (score < Math.round(4*grade)) {
		$(".box_image img").attr("src", "./images/sad.png");
	} else if (score < Math.round(7*grade)) {
		$(".box_image img").attr("src", "./images/smile.png");
	} else {
		$(".box_image img").attr("src", "./images/emoji.png");
	}

	// Displays the result
	$("#result").text(`${score}/${questions.length}`);
	updateScore(score);

	// Button click for display the questions and correct options along with the selected options
	$("#score-card .viewBtn").on("click", () => {
		displayResult(questions);
		$("#display-result").toggle();
	});

	// Back button to the home page
	$("#display-result .backBtn").on("click", () => {
		location.href = "./";
	});
}

// Updates the score of the current test taken in the database
function updateScore(score) {
	var category_name = $("#quiz-name").text();
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	$.ajax({
		method: "GET",
		url: "http://localhost:3000/user",
		success: function(result) {
			result.forEach(function (userData) {
				if (sessionStorage.getItem("userid") === userData.email) {
					var $categoryData = JSON.parse(userData.category);
			
					if (Object.keys($categoryData).includes(category_name) === false) {
						$categoryData[category_name] = [];
					}
					$categoryData[category_name].push({
						score: score,
						date: `${dd}/${mm}/${yyyy}`,
					});
					userData["category"] = JSON.stringify($categoryData);

					$.ajax({
						method: "PUT",
						url: "http://localhost:3000/user/" + userData.id,
						data: userData,
					});
				}
			});
		}
	});
}

// To display the questions along with correct answer and selected option.
function displayResult(questions) {
	var question_struct = $("#quiz-page #questionaire").html();

	$("#display-result #display-questions").html("");
	questions.forEach((question) => {
		var htmlTag = `<div class="resultQuestion" id="question-${question.id}">
							<h2 class="mb-4">Question ${question.id}</h2>
							${question_struct}
						</div>`;
		$("#display-result #display-questions").append(htmlTag);
		$("#display-result #display-questions").append("<hr/>");

		$(`#display-result #question-${question.id} .question`).text(question.question);
		
		// To display the options
		var options = 4;
		for (var i=1; i<=options; i++) {
			$(`#display-result #question-${question.id} #option_${i}`).text(question[`option_${i}`]);
		}

		// To query the options according to the selected options
		queryOptionResult(question)
	});
}

// Remove previously added classes and add new classes depending upon the selected options
function queryOptionResult(question) {
	var options = 4;
	for (var i=1; i<=options; i++) {
		// To remove the previously added choice option, correct option or wrong option class
        // If no option class, do not remove any class
		$(`#display-result #question-${question.id} #option_${i}`).removeClass(function() {
			var $class = $(this).attr("class").split(" ").pop();
			if ($class === "option-choice" || $class === "correct-choice" || $class === "wrong-choice") {
				return $class;
			} else {
				return "";
			}
		});
	}

	// Searches whether any options are selected else verifies whether that option is correct or not
	if (Object.keys(selectedOptions).includes(question.id.toString())) {
		if (question.correct_option === selectedOptions[question.id]) {
			$(`#display-result #question-${question.id} #option_${question.correct_option}`).addClass("correct-choice");
			console.log(question.id, "correct");
		} else {
			$(`#display-result #question-${question.id} #option_${question.correct_option}`).addClass("option-choice");
			$(`#display-result #question-${question.id} #option_${selectedOptions[question.id]}`).addClass("wrong-choice");
			console.log(question.id, "wrong + info");
		}
	} /*else {
		$(`#display-result #question-${question.id} #option_${question.correct_option}`).addClass("option-choice");
		console.log(question.id, "info");
	}*/ // Commented because not answered question's answers should not be revealed.
}

getCategory();