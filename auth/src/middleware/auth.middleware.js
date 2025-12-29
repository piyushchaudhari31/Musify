const {body,validationResult} = require('express-validator')

async function validate(req,res,next){
    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.status(400).json({
            error:error.array()
        })
    }

    next()
}

const registerValidator = [
    body('email').isEmail().withMessage("Invalid Email Address"),
    body('password').isLength({min:6}).withMessage("Password must be 6 character"),
    // body('fullName.firstName').notEmpty().withMessage("FirstName is Required"),
    // body('fullName.lastName').notEmpty().withMessage("LastName is Required"),
    validate
]

module.exports = {registerValidator}