import { Token } from "../../modals";

const UserConroller = {
    async valid(req , res, next){
        try{
            const username = req.body.username;
            const result = await Token.findOne({username : username});
            // console.log(result);
            if(result){
                res.json({message : "redirect Login/Logout Page"});
            }
            else{
                res.json({accessToken : result.token})
            }
        }
        catch(err){
            return next(err);
        }
    }
}
export default UserConroller;