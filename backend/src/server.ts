import appExpress from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING! as string, ).then(() => {
    console.log("Mongo connected");
    appExpress.listen(port, () => {
        console.log("Running on port : " + port);
    });
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});