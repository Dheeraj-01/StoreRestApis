import { User, Token } from "../../modals";
import { CustomErrorHandler, JWTService } from "../../services";
import bcript from 'bcrypt';
import Joi from "joi";


const loginController = {
     
        async login(req, res , next){

        // DONE Check Data is proper or not 
        const LoginSchema =  Joi.object({
            email : Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });
        // console.log(req.body);
        const { error }  = LoginSchema.validate(req.body);

        if(error){
            return next(error);
        }
        let accessToken;
        try{
            const user = await User.findOne({email: req.body.email});
            if(!user){
                return next(CustomErrorHandler.WrongLogin());
            }

            // compare the password
            const match = await bcript.compare(req.body.password,user.password);
            if(!match){
                return next(CustomErrorHandler.WrongLogin()); 
            }

            // generate Login
            accessToken = JWTService.sign({_id : user.id, role : user.role, email: user.email});

            const tokenExistsOrNot = await Token.findOne({username : user.username});
            if(tokenExistsOrNot){
                await Token.updateOne({username : user.username}, {token : accessToken});
            }
            else{
                // save token
                const userToken = new Token({
                    username: user.username,
                    token: accessToken
                });

                const SaveToken = await userToken.save();
            }
            
        }
        catch(err){
            next(err);
        }

        res.json({accessToken: accessToken});
    },

    async logout(req, res, next){
    
        try{
            const data = await Token.find({});
            // console.log(data);
            let len = Object.keys(data).length;
            if (len == 1){
                await Token.deleteOne({token: data[0].token});
            }
            res.json({message : "Redirect login/signUp"})
        }
        catch(err){
            return next(err.message);
        }

    }
};
export default loginController;