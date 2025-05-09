import User from "../models/userModel.js"

const loadRegister = async(req, res) => {
    try {
        res.render('registration')
    } catch (error) {
        console.log(error.message)
    }
}

export { loadRegister }