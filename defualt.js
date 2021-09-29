function upload() {
    //get your image
    var image = document.getElementById('image').files[0];
    //get your blog text
    var place_name = document.getElementById('place_name').value;
    var post = document.getElementById('post').value;


    var ratings = 0;
    if (document.getElementById('star5').checked) {
        ratings = 5
    }
    else if (document.getElementById('star4').checked) {
        ratings = 4
    }
    else if (document.getElementById('star3').checked) {
        ratings = 3
    }
    else if (document.getElementById('star2').checked) {
        ratings = 2
    }
    else if (document.getElementById('star1').checked) {
        ratings = 1
    }
    else {
        document.getElementById("error").innerHTML
            = "You have not selected any season";
    }
    //get image name
    var imageName = image.name;
    //firebase storage reference
    //it is the path where your image will be stored
    var storageRef = firebase.storage().ref('images/' + imageName);
    //upload image to selected storage reference
    //make sure you pass image here
    var uploadTask = storageRef.put(image);
    //to get the state of image uploading....
    uploadTask.on('state_changed', function (snapshot) {
        //get task progress by following code
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is " + progress + " done");
    }, function (error) {
        //handle error here
        console.log(error.message);
    }, function () {
        //handle successfull upload here..
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            //get your image download url here and upload it to databse
            //our path where data is stored ...push is used so that every post have unique id
            firebase.database().ref('blogs/').push().set({
                place: place_name,
                text: post,
                rates: ratings,
                imageURL: downloadURL
            }, function (error) {
                if (error) {
                    alert("Error while uploading");
                } else {
                    alert("Successfully uploaded");
                    //now reset your form
                    document.getElementById('post-form').reset();
                    getdata();
                }
            });
        });
    });

}

window.onload = function () {
    this.getdata();
}


function getdata() {
    firebase.database().ref('blogs/').once('value').then(function (snapshot) {
        //get your posts div
        var posts_div = document.getElementById('posts');
        //remove all remaining data in that div
        posts.innerHTML = "";
        //get data from firebase
        var data = snapshot.val();
        console.log(data);
        //now pass this data to our posts div
        //we have to pass our data to for loop to get one by one
        //we are passing the key of that post to delete it from database
        for (let [key, value] of Object.entries(data)) {
            posts_div.innerHTML = "<div class='col-sm-4 mt-2 mb-1'>" +
                "<div class='card'>" +
                "<img src='" + value.imageURL + "' style='height:250px;'>" +
                "<div class='card-body'><p class='card-text'><h3>" + value.place + "</h3>" + value.text + "<br> Rating: " + value.rates + "	&#127775;</p></div></div></div>" + posts_div.innerHTML;
        }

    });
}

function delete_post(key) {
    firebase.database().ref('blogs/' + key).remove();
    getdata();

}