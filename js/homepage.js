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

function displayCards(categoryData) {
    var $card = $("#card-templete").html();
    categoryData.forEach((category) => {
        $("#category.container .row").append($card.replace("card_id", "card_"+category.id));

        // Adding data and image to the card for specific category
        $("#card_" + category.id + " .card-text").text(category.name);
        $("#card_" + category.id + " #card-category").css("background-image", `linear-gradient(rgba(1,1,1,0.3), rgba(1,1,1,0.3)),url('../images/${category.image_url}')`);
        $("#card_" + category.id + " #card-category").on("click", () => {
            // Card click to redirect to a category quiz page or admin page, if logged in else 
            // login modal will pop up
            if(sessionStorage.getItem("userid") !== null) {
                if(sessionStorage.getItem("admin") === "true") {
                    window.location.href = './admin.html?category=' + category.name;
                } else {
                    window.location.href = './quiz.html?category=' + category.name;
                }
            } else {
                $("#login_model").modal('show');
            }
        });
    });
}

getCategory();