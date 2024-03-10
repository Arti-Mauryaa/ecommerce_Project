/**
 * create a middleware will check if the request body is proper and correct
 */
const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const auth_config = require("../configs/auth.config")
const verifySignUpBody = async (req, res, next)=>{

    try{

        //check for the name
        if(!req.body.name){
            return res.status(400).send({
                message : "Failed ! Name was not provide in request body"
            })
        }

        //check for the email
        if(!req.body.email){
            return res.status(400).send({
                message : "Failed ! email was not provide in request body"
            })
        }

        //check for the userId
        if(!req.body.userId){
            return res.status(400).send({
                message : "Failed ! userId was not provide in request body"
            })
        }

        //check if the user with the same userId is already present
        const user = await user_model.findOne({userId : req.body.userId})

        if(user){
            return res.status(400).send({
                message : "Failed ! user with same userId is already present"
            }) 
        }

        next()

    }catch(err){
        console.log("Error while validating the request object", err)
        res.status(500).send({
            message : "Error while validating the request body"
        })
    }
}

const verifySignInBody = async (req, res, next)=>{

    if(!req.body.userId){
        return res.status(400).send({
            message : "userId is not provided"
        })
    }

    if(!req.body.password){
        return res.status(400).send({
            message : "password is not provided"
        })
    }
    next()
}

const verifyToken = (req, res, next)=>{
    // check if the token is present in the header 
    const token = req.headers['x-access-token']

    if(!token){
        return res.status(403).send({
            message : "No token found : Unauthorized"
        })
    }

    //If it's token is valid
     jwt.verify(token, auth_config.secret , async (err , decoded)=>{
        if(err){
            return res.status(403).send({
                message : "Unauthorized !"
            })
        }
        const user = await user_model.findOne({userId : decoded.id})
        if(!user){
            return res.status(400).send({
                message : "Unauthorized, the user for this token does not exist"
            })
        }
        //set the user info in the req body
        req.user = user
        next()
     } )

   

    //then move to the next step


}

const isAdmin = (req, res, next)=>{
    const user = req.user
    if(user && user.userType == "ADMIN"){
        next()
    }else{
        return res.status(403).send({
            message : "Only ADMIN users are allowed to access this endpoint"
        })
    }
}

module.exports = {
    verifySignUpBody : verifySignUpBody,
    verifySignInBody : verifySignInBody,
    verifyToken : verifyToken,
    isAdmin : isAdmin
}