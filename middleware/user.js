import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config();

function userMiddleware(req, res, next){
    const token = req.headers.token;
    const response = jwt.verify(token, process.env.JWT_SECRET);

    if(response){
        req.userId = response.id;
        next();
    } else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
}
export { userMiddleware };