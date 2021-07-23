import Joi from "joi";
import { CustomErrorHandler, JWTService } from "../../services";
import { User , Token} from '../../modals'
import bcrypt from 'bcrypt';

const registerController = {


    async register(req , res , next){

        // DONE Check Data is proper or not 
        const registerSchema =  Joi.object({
            username : Joi.string().min(3).max(10).required(),
            email : Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            cpassword : Joi.ref('password')
        });

        // DONE data valid or not  
        // console.log(req.body);
        const { error }  = registerSchema.validate(req.body);
        if(error){
            return next(error);
        }

        // DONE prepare module

        // DONE check user is already register or not
        try{
            const exists = await User.exists({email : req.body.email});
            const exists_User = await User.exists({username : req.body.username});
            if (exists){
                return next(CustomErrorHandler.alreadyExists("Email Allready Exists !"));
            }
            if (exists_User){
                return next(CustomErrorHandler.alreadyExists("UserName Allready Exists !"));
            }
        }
        catch(err){
            return next(err);
        }

        // hashed the password
        const {username, email, password} = req.body;

        const hashPassword = await bcrypt.hash(password,10);

        // prepare modal 
        const user = new User({
            username : username,
            email : email,
            password: hashPassword
        });

        let accessToken;
        // DONE add user on the database
        try{
            const result = await user.save();
            // generate Token 
            accessToken = JWTService.sign({_id : result.id, role : result.role, email: email});


            const tokenExistsOrNot = await Token.findOne({username : username});
            if(tokenExistsOrNot){
                await Token.updateOne({username : username}, {token : accessToken});
            }
            else{
                const userToken = new Token({
                    username: username,
                    token: accessToken
                });
    
                const SaveToken = await userToken.save();
            }
            

        }
        catch(err){
            return next(err);
        }


        res.json({accessToken: accessToken});

    }
}

export default registerController;