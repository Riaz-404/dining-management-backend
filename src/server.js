import app from "./app.js";
import "dotenv/config";
import dbConnect from "./Database/dbConnect.js";

const port = process.env.PORT;

dbConnect()
  .then(result => {
    if (result) {
      console.log("MongoDB Connected Successfully");
      app.listen(port, () => {
        console.log(`Listening at port ${port}`);
      });
    }
  })
  .catch(error => {
    console.error("MongoDB connection error! ", error.message);
  });


