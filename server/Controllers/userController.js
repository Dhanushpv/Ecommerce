let users = require('../db/models/user');
let Usertype = require('../db/models/usertypes');
let Categories = require('../db/models/Categories');
let Gender = require('../db/models/gender');
let AddData = require('../db/models/addProduct')
const { success_function, error_function } = require('../utli/ResponseHandler');
const bcrypt = require('bcryptjs')
// // const jwt = require('jsonwebtoken')


exports.registerUser = async function (req, res) {
    try {
        let body = req.body;
        console.log("body", body);
        let Password = req.body.password

        // Find user type by name
        let user_type = await Usertype.findOne({ usertype: body.usertype });
        if (!user_type) {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "Invalid user type"
            });
        }

        console.log("user type", user_type);
        let id = user_type._id;  // Get the ObjectId
        console.log("id", id);

        // Assign the ObjectId to the usertype field
        body.usertype = id;


        let salt = bcrypt.genSaltSync(10);
        let hashedpasword = bcrypt.hashSync(Password, salt);
        console.log("password : ", hashedpasword)

        let data = {
            name: body.name,
            email: body.email,
            phone_no: body.phone_no,
            password: hashedpasword,
            usertype: body.usertype

        }

        let existingUser = await users.findOne({ email: body.email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "Email already exists"
            });
        }



        // Create the new user with the correct usertype ObjectId
        let userData = await users.create(data);
        console.log('userData', userData);

        let response = success_function({
            success: true,
            statuscode: 200,
            message: "User successfully added.",
            data: userData
        });
        res.status(response.statuscode).send(response);
        return;

    } catch (error) {
        console.log("error: ", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "Error adding user"
        });
        res.status(response.statuscode).send(response);
        return;
    }
}

exports.getUsertypes = async function (req, res) {
    try {

        let usertypes = await Usertype.find({ usertype: { $ne: 'Admin' } });
        console.log("usertypes :", usertypes);

        let response = success_function({
            success: true,
            statuscode: 200,
            data: usertypes,
            message: "User successfully added.",

        });
        res.status(response.statuscode).send(response);
        return;


    } catch (error) {

        console.log("error: ", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "Error adding user"
        });
        res.status(response.statuscode).send(response);
        return;
    }


}

exports.soloUser = async function (req, res) {

    try {

        Singleid = req.params.id
        console.log("Singleid", Singleid);

        SingleData = await users.findOne({ _id: Singleid });
        console.log("SingleUser", SingleData);

        let response = success_function({
            success: true,
            statuscode: 200,
            data: SingleData,
            message: "successfully get the single data.."
        })
        res.status(response.statuscode).send(response)
        return;

    } catch (error) {

        console.log("error : ", error);
        let response = error_function({
            success: false,
            statuscode: 400,

            message: "error"
        })
        res.status(response.statuscode).send(response)
        return;
    }

}

exports.fetchingCategory = async function (req, res) {

    try {

        let categories = await Categories.find()
        console.log("categories", categories);

        let response = success_function({
            success: true,
            statuscode: 200,
            data: categories,
            message: "User successfully added.",

        });
        res.status(response.statuscode).send(response);
        return;

    } catch (error) {

        console.log("error: ", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "Error adding user"
        });
        res.status(response.statuscode).send(response);
        return;

    }

}

exports.fetchingGender = async function (req, res) {

    try {

        let gender = await Gender.find()
        console.log("categories", gender);

        let response = success_function({
            success: true,
            statuscode: 200,
            data: gender,
            message: "User successfully added.",

        });
        res.status(response.statuscode).send(response);
        return;

    } catch (error) {

        console.log("error: ", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "Error adding user"
        });
        res.status(response.statuscode).send(response);
        return;

    }

}

exports.addProducts = async (req, res) => {
    try {
        const body = req.body;

        // Fetch related data
        const category = await Categories.findOne({ category: body.category });
        console.log("category",category)

        let category_id = category._id;
        console.log("category_id",category_id);
        body.category=category_id



        const gender = await Gender.findOne({ gender: body.gender });
        console.log("gender",gender)

        let gender_id = gender._id;
        console.log("gender_id",gender_id);
        body.gender=gender_id

        

        // Log the uploaded files to debug
        console.log("Uploaded Files:", req.files);  // Should show the files

        // Prepare images if files are uploaded
        const images = (req.files || []).map(file => ({
            url: file.path,  // Store the file path
            alt: req.body.altText || 'Product Image',  // Optional alt text
        }));
        body.images =images


        const productData = await AddData.create(body);
        console.log(productData);
        res.status(200).send({ success: true, message: 'Product successfully added.', data: productData });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(400).send({ success: false, message: "Error adding product" });
    }
};

exports.viewAllProducts = async (req, res) => {
    try {



        let productOverview = await AddData.find().populate('category').populate('gender');

        let response = success_function({
            success: true,
            statuscode: 200,
            data: productOverview,
            message: "User successfully added.",

        });
        res.status(response.statuscode).send(response);
        return;

    }

    catch (error) {

        console.log("error: ", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "Error adding user"
        });
        res.status(response.statuscode).send(response);
        return;
    }
}




