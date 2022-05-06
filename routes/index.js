const authRouter = require("./auth.routes");
const courseRouter = require("./course.routes");

function route(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/course", courseRouter);

  //   app.use("/api/user", userRouter);
}

module.exports = route;
