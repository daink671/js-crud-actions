const {MongoClient} = require('mongodb');

function listMovies(){
    const dotenv = require('dotenv');
    dotenv.config();
    const dbURI = process.env.DB_URL;
    const dbName = 'Cinema';


    function loadData(data){
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(dbURI);
            try{
                await client.connect();

                const db = client.db(dbName);

                results = await db.collection('movies').insertMany(data);
                resolve(results);
                client.close();
            }
            catch(error){
                reject(error)
            }
            
        })
    }
    return {loadData}
}

module.exports = listMovies();
