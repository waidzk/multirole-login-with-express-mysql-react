import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

const app = express();

// agar session tetap tersimpan walaupun server restart.
// session disimpan ke dalam database
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

// generate table di db.
// (async()=>{
//     await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto", //jika kita menggunakan https maka secure true, tapi agar auto masukkan 'auto
    },
  })
);

app.use(
  cors({
    credentials: true, //agar frontend dapat mengirimkan req beserta cooiki beserta menyertakan credentialnya.
    origin: "http://localhost:3000", //agar hanya domain frontend yang bisa mengakses api dari backend
  })
);
app.use(express.json()); //agar dapat mengakses data dalam format json
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

// generete table session di db
// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running..");
});
