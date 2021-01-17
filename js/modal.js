var arr = [];

$.ajax({
    type: "GET",
    url: "http://localhost:3000/user",
    success: function (data) {
        arr = data;
    }
});

//password checking
$('#password, #cpassword').on('keyup', function () {
    if ($('#password').val() === $('#cpassword').val()) {
        $('#out').html("Matching");
        $('#out').css('color', 'green');
        //$('#but').removeAttr("disabled");
    }
    else {
        $('#out').html("Not Matching");
        $('#out').css('color', 'red');
        //$('#but').attr("disabled", "true");
    }
});

//registration form submission
$('#but').on("click", function(a) {
    a.preventDefault();
    
    let name = $('#name').val();
    let email = $('#email').val();
    let password = $('#password').val();
    let phone = $('#phone').val();

    //Form Validation 
    var emailReg=/^[A-Za-z0-9_]+\@[A-Za-z0-9_]+\.[A-Za-z0-9_]+/;
    var phoneReg= /[0-9]{10}/;

    if(name !== "" && emailReg.test(email) && phoneReg.test(phone)) {
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/user",
            data: {
                "name": name,
                "email": email,
                "password": password,
                "phone": phone,
                "category": "{}"
            },
            success: function(element) {
                sessionStorage.setItem('userid', element.email);
                sessionStorage.setItem('username', element.name);
                sessionStorage.setItem('admin', "false");
                window.location.href = './';
            }
        });
    } else {
        $('#but').prop('disabled','true');
    };
});

//login form submission
$("#but1").on("click", function(a) {
    a.preventDefault();
    if (email === "" && password === "") {
        $('#wro').html("Please Enter Correct Username & Password");
        $('#wro').css('color', 'red');
    }
    else {
        $.ajax({
            method: "GET",
            url: "http://localhost:3000/admin",
            success: function(result) {
                var $flag = 0;
                result.forEach(function(element) {
                    if($('#email1').val() === element.email && $('#password1').val() === element.password){
                        sessionStorage.setItem('userid',element.email);
                        sessionStorage.setItem('admin',"true");
                        window.location.reload('homepage.html');
                        $flag = 1;
                    }
                });
                if ($flag === 0) {
                    $.ajax({
                        method: "GET",
                        url: "http://localhost:3000/user",
                        success: function(result1) {
                            var $flag1 = 0;
                            result1.forEach(function(element) {
                                if($('#email1').val() === element.email && $('#password1').val() === element.password){
                                    sessionStorage.setItem('userid',element.email);
                                    sessionStorage.setItem('username',element.name);
                                    sessionStorage.setItem('admin',"false");
                                    window.location.reload('homepage.html');
                                    $flag1 = 1;
                                }
                            });
                            if ($flag1 === 0) {
                                $('#wro').html("Please Enter Correct Username & Password");
                                $('#wro').css('color', 'red');
                            }
                        }
                    });
                }
            }
        });   
    }
});

//email validation
$('#email').on('keyup', function () {

    var email = $('#email').val();
    var flag = 0;
    for (var i = 0; i < arr.length; i++) {
        if (email === arr[i].email) {
            $('#inval').html("Already registered user");
            $('#inval').css('color', 'red');
            $('#but').attr("disabled", "true");
            flag = 1;
            break;

        }
    }
    if (flag === 0) {
        $('#but').removeAttr("disabled");
        $('#inval').html("Ready to go");
        $('#inval').css('color', 'green');

    }
    if (email === "") {
        $('#but').attr("disabled", "true");
        $('#inval').html("enter your email");
        $('#inval').css('color', 'red');
    }
});