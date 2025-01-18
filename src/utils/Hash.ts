import bcrypt from 'bcrypt'
export default class Hash{
    protected static saltrounds=10
    static make(planText:string){
        const hash = bcrypt.hashSync(planText, this.saltrounds);
        return hash
    }
    static compare(plainText:string,hashText:string){
        return bcrypt.compareSync(plainText, hashText); 
    }
}