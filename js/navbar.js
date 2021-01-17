function toggleNav() {
    if ($('#navbarNav').css('display') === 'none') {
        $('#navbarNav').show();
    } else {
        $('#navbarNav').hide();
    }
}

function navAdd() {
    if(sessionStorage.getItem("userid") === null) {
        $("#navBar").addClass("navbar-expand-sm");
        $(".user").addClass("navbar-toggler-icon");
        $(".user").removeClass("border-btn");
        $("#dashboard").hide();
        $("#logout").hide(); 
    } else {
        $("#navBar").removeClass("navbar-expand-sm");
        $(".user").removeClass("navbar-toggler-icon");
        $(".user").addClass("border-btn");
        $("#signin").hide();          
        $("#signup").hide();
        if(sessionStorage.getItem("admin") === "true") {
            $("#dashboard").hide(); 
            $(".user").html("Admin");
            $(".user").addClass("font-16px")
        } else {
            $(".user").html(sessionStorage.getItem("username")[0]);
            $(".user").removeClass("font-16px")
        }
    }
}

function dashboard() {
    if(sessionStorage.getItem("userid") !== null) {
        if(sessionStorage.getItem("admin") === "false") {
            location.href = "./dashboard.html";
        }
    }
}

function logout() {
    if(sessionStorage.getItem("userid") !== null) {
        sessionStorage.removeItem("userid");
        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("username")
        location.href = "./";
    }
}

navAdd();