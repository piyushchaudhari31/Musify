const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { publishTOQueue } = require('../broker/rabbit')

const url = "https://musify-song.onrender.com"


async function userRegister(req, res) {
    try {
        const { email, password, fullName: { firstName, lastName }, role = "user" } = req.body

        const isAlreadyExist = await userModel.findOne({ email })
        if (isAlreadyExist) {
            return res.status(404).json({
                message: "User is Already Exist"
            })
        }

        const user = await userModel.create({
            email,
            password: await bcrypt.hash(password, 10),
            fullName: {
                firstName,
                lastName
            },
            role
        })

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                fullName: user.fullName

            }, process.env.JWT_SECRET)

        await publishTOQueue("user Created", {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        })

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });


        res.status(200).json({
            message: "User Created Successfully",
            user

        })


    } catch (error) {
        return res.json({
            message: error.message
        })

    }
}

async function googleAuth(req, res) {

    try {
        const user = req.user

        const isAlreadyExist = await userModel.findOne(
            {
                $or: [
                    { email: user.emails[0].value },
                    { googleId: user.id }
                ]
            })

        if (isAlreadyExist) {

            const token = jwt.sign(
                {
                    id: isAlreadyExist._id,
                    role: isAlreadyExist.role,
                    fullName: isAlreadyExist.fullName
                }
                , process.env.JWT_SECRET)

            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
            });

            if(isAlreadyExist.role === "artist"){
                res.redirect(`${url}/artist/dashboard`)

            }
            res.redirect(`${url}/`)
            res.status(201).json({
                message: "user Login successfully",
                user: {
                    id: isAlreadyExist._id,
                    email: isAlreadyExist.email,
                    fullName: isAlreadyExist.fullName,
                    role: isAlreadyExist.role

                }
            })

        }

        const newUser = await userModel.create({
            googleId: user.id,
            email: user.emails[0].value,
            fullName: {
                firstName: user.name.givenName,
                lastName: user.name.familyName
            }
        })

        const token = jwt.sign({ id: newUser._id, role: newUser.role, fullName: newUser.fullName }, process.env.JWT_SECRET)
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        if(newUser.role === "artist"){
            res.redirect(`${url}/artist/dashboard`)
        }
        res.redirect(`${url}/`)
        res.status(200).json({
            message: "User Created Successfully",
            newUser
        })

    } catch (error) {
        console.log(error.message);


    }

}

async function LoginUser(req, res) {

    try {
        const { email, password } = req.body

        const isEmail = await userModel.findOne({ email })
        if (!isEmail) {
            return res.status(400).json({
                message: "Invalid Email"
            })
        }

        const isPassword = await bcrypt.compare(password, isEmail.password)

        if (!isPassword) {
            return res.status(400).json({
                message: "Invalid Password"
            })
        }

        const token = jwt.sign(
            {
                id: isEmail._id,
                role: isEmail.role,
                fullName: isEmail.fullName
            }, process.env.JWT_SECRET)
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });




        res.status(200).json({
            message: "Login Successfully",
            user: {
                Name: isEmail.fullName.firstName + " " + isEmail.fullName.lastName,
                email: isEmail.email,
                role: isEmail.role
            }
        })
    } catch (error) {
        console.log(error.message);


    }
}

async function checkAuth(req, res) {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ isLoggedIn: false })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return res.status(200).json({
            isLoggedIn: true, user: decoded
        })
    } catch (error) {
        return res.status(401).json({
            isLoggedIn: false
        })
    }
}

module.exports = { userRegister, googleAuth, LoginUser, checkAuth } 