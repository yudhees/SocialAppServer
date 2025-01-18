import knexConfig from "../config/database"

export default class BaseModel{
    public db
    constructor(tableName:string){
        this.db=knexConfig.table(tableName)
        const originalInsert = this.db.insert;
        this.db.insert = (records:any) => {
            if (Array.isArray(records)) {
                records.forEach(record => {
                    record.created_at = new Date(); 
                });
            } else {
                records.created_at = new Date();
                records.updated_at = new Date();
            }
            return originalInsert.call(this.db, records);
        };
    }
}