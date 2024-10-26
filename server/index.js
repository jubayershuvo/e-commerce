import app from "./src/app.js";
import db_connect from "./src/db/confg.js";
import { port } from "./src/variables.js";

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
    db_connect()
})