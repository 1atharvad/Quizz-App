
function cardClick(category)
{
    if(sessionStorage.getItem("userid") !== null) {
        if(sessionStorage.getItem("admin") === "true") {
            window.location.href = './admin.html?category=' + category;
        } else {
            window.location.href = './quiz.html?category=' + category;
        }
    } else {
        $("#login_model").modal('show');
    }
}