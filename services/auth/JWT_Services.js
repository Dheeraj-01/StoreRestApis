import {JWT_SECRET} from '../../config'
import jwt from 'jsonwebtoken'
class JWTService{
    static sign(payload, expiry = '1y',secret = JWT_SECRET){
        return jwt.sign(payload, secret, {expiresIn : expiry});
    }
}
export default JWTService;