// Create a new user and add all the categories
function postRequest(categoryData) {
    $.ajax({
        method:'POST',
        url: "http://localhost:3000/users",
        data: {
            "email": "xyz@gmail.com",
            "password": "asdf1234",
            "phone": "8458956152",
            "category": JSON.stringify(categoryData).split(`"`).join(`\"`)
        },
        success: function(result) {
            console.log(result); 
        }}
    );
}

data = {
    "Sports": [],
    "Space": []
};

//postRequest(data);

// Display all the user data
function getData() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/users",
        success: function(result) {
            result.forEach(function(data) {
                var $category = JSON.parse(data.category);
                console.log($category["Space"]);
            });
        }
    });
}

//getData();

// Add new score in user profile
function putData(email, score, date) {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/users",
        success: function(result) {
            result.forEach(function(userData) {
                if (email === userData.email) {
                    var $categoryData = JSON.parse(userData.category);
                    $categoryData["Space"][$categoryData["Space"].length] = {
                        "score": score,
                        "date": date
                    };
                    userData["category"] = JSON.stringify($categoryData);
                    console.log(data);
                    $.ajax({
                        method: 'PUT',
                        url: "http://localhost:3000/users/" + userData.id,
                        data: userData,
                        success: function(result) {
                            console.log(result); 
                        }}
                    );
                }
            });
        }
    });
}

//putData("abc@gmail.com", 8, "02/06/1202");