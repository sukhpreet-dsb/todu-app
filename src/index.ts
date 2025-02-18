import app from "./app";
import { connectDB } from "./config/db";

const port = 5000;
connectDB()
  .then(() => {
    console.log("MongoDB Connected Successfully");
    app.listen(port, () => {
      /* eslint-disable no-console */
      console.log(`Listening: http://localhost:${port}`);
      /* eslint-enable no-console */
    });
  })
  .catch((err) => {
    console.log("ERROR:", err);
  });
