function signUP() {
    window.location.href = 'signUP.html';
}

function login() {
    window.location.href = 'login.html';
}

async function usertypeSelection() {

    let response = await fetch('/users', {
        method: 'GET'
    });
    let prased_data = await response.json();
    console.log("prased_data", prased_data)

    let data = prased_data.data
    console.log("data", data);


    let selectusertype = document.getElementById('selection_container');

    let rows = '<option selected = "Select Your Type" disabled>Select Your Type</option>'

    for (let i = 0; i < data.length; i++) {

        rows += `
              <option value="${data[i].usertype}">${data[i].usertype}</option>
    
            `
    }


    selectusertype.innerHTML = rows

}

async function Addpage() {
    try {
        // First fetch to get categories
        let response = await fetch('/fetchCategory', {
            method: 'GET'
        });
        let parsed_data = await response.json();
        console.log("parsed_data", parsed_data);

        let data = parsed_data.data;
        console.log("data", data);

        let selection_Categories = document.getElementById('selection_Categories');
        let rows = '<option selected disabled>Select Categories</option>';

        for (let i = 0; i < data.length; i++) {
            rows += `
                <option value="${data[i].category}">${data[i].category}</option>
            `;
        }

        selection_Categories.innerHTML = rows;

        // Second fetch to get additional data (e.g., subcategories or related information)
        let additionalResponse = await fetch('/fetchGender', {
            method: 'GET'
        });
        let additionalData = await additionalResponse.json();
        console.log("additionalData", additionalData);

        let genderChoice = additionalData.data; // Assuming the structure is similar
        let selection_Subcategories = document.getElementById('selection_Gender');
        let subcategoryRows = '<option selected disabled>Select Gender</option>';

        for (let i = 0; i < genderChoice.length; i++) {
            subcategoryRows += `
                <option value="${genderChoice[i].gender}">${genderChoice[i].gender}</option>
            `;
        }

        selection_Subcategories.innerHTML = subcategoryRows;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function AddUser(event) {
    event.preventDefault();
    console.log("reacheed.......");

    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let phoneno = document.getElementById('phoneno').value
    let usertype = document.getElementById('selection_container').value

    //validation


    if (!name) {
        alert('Name is required');
        return;
    }
    if (!email || !validateEmail(email)) {
        alert('Valid email is required');
        return;
    }
    function validateEmail(email) {
        let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    if (!password || password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    // Phone number validation function (basic check for digits and length)
    function validatePhone(phone) {
        let re = /^\d{10}$/; // Assumes 10-digit phone number format
        return re.test(phone);
    }
    if (!phoneno || !validatePhone(phoneno)) {
        alert('Please enter a valid phone number');
        return;
    }


    if (!usertype) {
        alert('User type must be selected');
        return;
    }



    data = {
        name,
        email,
        password,
        phoneno,
        usertype
    }

    console.log("data", data)

    let strdata = JSON.stringify(data);
    console.log("strdata", strdata);

    try {
        let response = await fetch('/user', {
            method: 'POST',
            headers: {
                "Content-Type": "Application/json",

            },
            body: strdata,

        });
        console.log("response", response);
        let parsed_Response = await response.json()
        if (response.status === 200) {
            alert(' User successfully created');
            window.location = `login.html`
        } else {
            alert(parsed_Response.message)
        }

    } catch (error) {

    }

}

function logout() {
    console.log("Reached....at log out");

    let params = new URLSearchParams(window.location.search);
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    // Remove login-related data from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    console.log("token", token);

    // If the token exists, remove it and redirect to the index page
    if (token) {
        localStorage.removeItem(token_key);
        window.location.href = "index.html";
    } else {
        console.log("No token found");
    }

    // Update login section in the UI
    document.getElementById('loginSection').innerHTML = `
        <span onclick="signUP()">SIGN IN</span> 
        / <span onclick="login()">LOGIN</span>
    `;

    // Display success alert
    alert('Logged out successfully');

    // Check if the user is a buyer, show alert and redirect
    if (localStorage.getItem('userType') === 'buyer') {
        alert('You have been logged out. You need to log in again to access the buyer page.');
        window.location.href = 'login.html'; // Redirect to the login page
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const loginSection = document.querySelector('.loginSection');

    if (!loginSection) {
        console.error("Error: loginSection element not found in the DOM.");
        return;
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');

    if (isLoggedIn) {
        if (userType === 'Buyer' || userType === 'Seller') {
            loginSection.innerHTML = `
               <!-- <span>${userType}</span>--!>
                <button id="logoutButton" style="margin-left: 10px;">Logout</button>
            `;

            document.getElementById('logoutButton').addEventListener('click', function () {
                logout();
            });
        } else {
            console.error("Error: Unknown user type.");
            loginSection.innerHTML = `
                <span onclick="signUP()">SIGN IN</span>
                / <span onclick="login()">LOGIN</span>
            `;
        }
    } else {
        loginSection.innerHTML = `
            <span onclick="signUP()">SIGN IN</span>
            / <span onclick="login()">LOGIN</span>
        `;
    }
});

async function userLogin(event) {
    event.preventDefault();  // Prevent form submission

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let data = { email, password };
    let strData = JSON.stringify(data);

    try {
        let response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: strData
        });

        let parsed_Response = await response.json();
        let token_data = parsed_Response.data;
        let usertype = token_data.user_type.usertype;
        let token = token_data.token;
        let id = token_data.id;
        let token_key = id;

        // Store data in localStorage
        localStorage.setItem(token_key, token);
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userType', usertype);

        // Update loginSection
        const loginSection = document.getElementById('loginSection');
        if (loginSection) {
            loginSection.innerHTML = `
                <span class="user-icon">
                    <img src="./images/user-icon.png" alt="User Icon" style="width: 30px; height: 30px;">
                </span>
                <span>${usertype}</span>
                <button id="logoutButton" style="margin-left: 10px;">Logout</button>
            `;

            // Add event listener to the logout button
            document.getElementById('logoutButton').addEventListener('click', function () {
                logout();
            });
        }

        // Redirect based on user type
        if (usertype === "Admin") {
            alert("Admin logged in successfully");
            window.location.href = `Admin.html?login=${token_key}&id=${id}`;
        } else if (usertype === "Buyer") {
            alert("Buyer logged in successfully");
            window.location.href = `index.html?login=${token_key}&id=${id}`;
        } else if (usertype === "Seller") {
            alert("Seller logged in successfully");
            window.location.href = `Seller.html?login=${token_key}&id=${id}`;
        } else {
            alert("Unknown user type");
        }
    } catch (error) {
        console.log("Error during login:", error);
    }
}

async function buyerSection() {

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);
    try {
        const response = await fetch(`/individualUser/${id}`, {
            headers: {
                "Authorization": token, // Send the token in the Authorization header
            },
        });
        console.log(response)

        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }

        const user = await response.json();
        console.log("user", user)

        let data = user.data;
        console.log("data", data);

        // Display user details
        document.querySelector(".buyerProfile").innerHTML = `

            <div class="text-center dropdown">
                <button class="dropbtn" aria-haspopup="true" role="button">
                    <span class="text-break"><strong>Hello,</strong> ${data.name}</span><br>
                    <span><strong>Account & Lists</strong></span>
                </button>
                <div class="dropdown-content pt-3" role="menu">
                    <span class="dropdown-item  pt-3" tabindex="0">abcd</span>
                    <span class="dropdown-item  pt-3" tabindex="0">abcd</span>
                    <span class="dropdown-item  pt-3" tabindex="0">abcd</span>
                    <span class="dropdown-item  pt-3" tabindex="0">abcd</span>
                    <span class="dropdown-item  pt-3 pb-3" tabindex="0">abcd</span>
                </div>
            </div>

            
        `;
    } catch (error) {
        console.error("Error fetching user details:", error);
        document.getElementById("user-details").innerHTML =
            "<p>Unable to load user details. Please try again later.</p>";
    }



}

async function fetchUserDetails() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);
    try {
        const response = await fetch(`/individualUser/${id}`, {
            headers: {
                "Authorization": token, // Send the token in the Authorization header
            },
        });
        console.log(response)

        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }

        const user = await response.json();
        console.log("user", user)

        let data = user.data;
        console.log("data", data);

        // Display user details
        document.querySelector(".profile").innerHTML = `

            <div class="text-center dropdown">
                <button class="dropbtn" aria-haspopup="true" role="button">
                    <span class="text-break"><strong>Hello,</strong> ${data.name}</span><br>
                    <span><strong>Account & Lists</strong></span>
                </button>
                <div class="dropdown-content pt-3" role="menu">
                    <span onClick="AddPage()" class="dropdown-item  " tabindex="0">Add Page</span>
                    <span class="dropdown-item  pt-3" tabindex="0">abcd</span>
                    <span class="dropdown-item  pt-3" tabindex="0">abcd</span>
                    <span class="dropdown-item  pt-3" tabindex="0">abcd</span>
                    <span class="dropdown-item  pt-3" tabindex="0">abcd</span>
                    <span class="dropdown-item  pt-3 pb-3" tabindex="0">abcd</span>
                </div>
            </div>

            
        `;

        let responseofProductList = await fetch('/fullProductList', {
            method: 'GET'
        });
        let parsed_data = await responseofProductList.json();
        console.log("ProductList", parsed_data);
        
        let dataofProductList = parsed_data.data;
        console.log("dataofProductList", dataofProductList);
        
        let getAllprducts = document.getElementById("productListContainer");
        let rows = '';
        
        for (let i = 0; i < dataofProductList.length; i++) {
            // Get the images for the current product
            let images = dataofProductList[i].images;
            console.log("Images for product", i, images);
        
            // Loop through each image for this product
            for (let j = 0; j < images.length; j++) {
                rows += `
                    <ul class="cards">
                        <li>
                            <a href="" class="card">
                                <img src="${images[j]}" class="card__image" alt="Product Image ${j + 1}" />
                                <div class="card__overlay">
                                    <div class="card__header">
                                        <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                     
                                    </div>
                                    <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?</p>
                                </div>
                            </a>      
                        </li>
                    </ul>
                `;
            }
        }
        
        // Update the inner HTML with the new rows
        getAllprducts.innerHTML = rows;
        

    } catch (error) {
        console.error("Error fetching user details:", error);
        document.getElementById("user-details").innerHTML =
            "<p>Unable to load user details. Please try again later.</p>";
    }

}

function AddPage() {


    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    console.log(token)
    console.log(id)

    window.location.href = `addPage.html?login=${token}&id=${id}`


}

async function AddProducts(event) {
    event.preventDefault();

    let title = document.getElementById('title').value.trim();
    let description = document.getElementById('description').value.trim();
    let price = document.getElementById('price').value.trim();
    let category = document.getElementById('selection_Categories').value.trim();
    let gender = document.getElementById('selection_Gender').value.trim();
    let brand = document.getElementById('brand').value.trim();
    let stock = document.getElementById('stock').value.trim();
    let rating = document.getElementById('rating').value.trim();
    let images = document.getElementById('image');

    if (!title || !description || !price || !category || !gender || !brand || !stock || !rating) {
        alert("All fields are required. Please fill out the form completely.");
        return;
    }

    if (images.files && images.files.length > 0) {
        let formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('gender', gender);
        formData.append('brand', brand);
        formData.append('stock', stock);
        formData.append('rating', rating);

        for (let file of images.files) {
            formData.append('images', file);
        }

        try {
            let response = await fetch('/uploadProducts', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 200) {
                alert('The product has been added successfully.');
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            alert('An error occurred while adding the product. Please try again later.');
        }
    } else {
        alert("Please upload at least one image for the product.");
    }
}




// addProduct file input type section
const imageInput = document.getElementById("image");
const uploadMessage = document.getElementById("upload-message");
const svgIcon = document.querySelector(".header svg"); // Select the SVG icon

imageInput.addEventListener("change", (event) => {
    // Remove the SVG icon when an image is uploaded
    if (svgIcon) {
        svgIcon.remove();
    }

    // Clear the current content of the message
    uploadMessage.innerHTML = "";

    // Get the selected files
    const files = event.target.files;

    // Loop through each file
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Ensure the file is an image
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            // When the file is loaded, create an img element with a remove button
            reader.onload = (e) => {
                // Container for the image and button
                const imageContainer = document.createElement("div");
                imageContainer.style.position = "relative";
                imageContainer.style.display = "inline-block";
                imageContainer.style.margin = "5px";

                // Create the image
                const img = document.createElement("img");
                img.src = e.target.result;
                img.style.width = "200px";
                img.style.height = "200px";
                img.style.objectFit = "contain";
                img.style.border = "1px solid black";

                img.alt = file.name;

                // Create the remove button
                const removeButton = document.createElement("button");
                removeButton.textContent = "✖";
                removeButton.style.position = "absolute";
                removeButton.style.top = "0";
                removeButton.style.right = "0";
                removeButton.style.backgroundColor = "";
                removeButton.style.color = "white";
                removeButton.style.border = "none";
                removeButton.style.borderRadius = "50%";
                removeButton.style.cursor = "pointer";
                removeButton.style.width = "20px";
                removeButton.style.height = "20px";
                removeButton.style.display = "flex";
                removeButton.style.justifyContent = "center";
                removeButton.style.alignItems = "center";

                // Add click event to remove the image
                removeButton.addEventListener("click", () => {
                    imageContainer.remove();
                });

                // Append the image and button to the container
                imageContainer.appendChild(img);
                imageContainer.appendChild(removeButton);

                // Append the container to the upload message
                uploadMessage.appendChild(imageContainer);
            };

            // Read the file as a data URL
            reader.readAsDataURL(file);
        }
    }
});

// addProduct file input type section END.......

