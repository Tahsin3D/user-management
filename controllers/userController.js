import User from "../models/userModel.js"

const loadRegister = async(req, res) => {
    try {
        res.render('registration')
    } catch (error) {
        console.log(error.message)
    }
}

const insertUser = async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.phone,
            image: req.body.filename,
            password: req.body.password,
            is_admin: false,
        });

        const userData = await user.save();

        if(userData){
            res.render("registration", {message: "Registration successful."})
        }
        else {
            res.render("registration", {message: "Registration Unsuccessful."})
        }
    } catch (error) {
        console.log(error)
    }
}

export { loadRegister, insertUser }