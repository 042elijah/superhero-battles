// Main backend app file.
const express = require("express");
const app = express();
const userRouter = require("./controller/userRouter");
const battleRouter = require("./controller/battleRouter");
const accountRouter = require("./util/accountAccess/accountRouter")

app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
});

const logger = require("./util/logger");

const PORT = 4000;

app.use("/users", userRouter);
app.use("/battleground", battleRouter);
app.use(["/register", "/login"], accountRouter)


app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});