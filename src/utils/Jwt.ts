import jwtSimple from 'jwt-simple'
export class Jwt{
    public static secret = 'fe1a1915a379f3be5394b64d14794932'
    static encode(payload:string){
        const token=jwtSimple.encode(payload,this.secret)
        return token
    }
    static decode(token:string){
        const data=jwtSimple.decode(token,this.secret)
        return JSON.parse(data)
    }
}