import { ObjectId } from "mongodb";
import passport from "passport";
import { Strategy as JwtStrategy, type StrategyOptions } from "passport-jwt";
import passportLocal from "passport-local";
import { matchPassword } from "../../api/auth/auth.helpers";
import { Users } from "../../api/user/user.model";
import cookiesConfig from "../../configs/cookiesConfig";

const LocalStrategy = passportLocal.Strategy;

const localLogin = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async (username: string, password: string, done) => {
    // get user by username or email
    const user = await Users.findOne({
      $or: [{ "account.username": username }, { "account.email": username }],
    });
    if (user === null) {
      return done(null, false, {
        message: "Credenciales incorrectas",
      });
    }
    // match password validation
    const matchPasswords = await matchPassword(user.account.password, password);
    if (!matchPasswords) {
      return done(null, false, { message: "Credenciales incorrectas" });
    }
    return done(null, user);
  },
);

const jwtOptions: StrategyOptions = {
  jwtFromRequest: (req) => {
    // Read token from header or cookies
    let token = null;
    if (req.headers.authorization) {
      token = req.headers.authorization;
    }
    if (req.cookies[cookiesConfig.access.name]) {
      token = req.cookies[cookiesConfig.access.name];
    }
    return token;
  },
  secretOrKey: process.env.JWT_ACCESS_SECRET!,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await Users.findOne(
      {
        _id: new ObjectId(payload._id),
      },
      // { projection: { "account.isDeleted": 1, "account.isActivate": 1 } },
      {
        projection: { "account.password": 0 },
      },
    );

    if (user === null) {
      return done(null, false, { message: "Invalid token" });
    }

    if (user.account.isDeleted) {
      return done(null, false, { message: "Tu cuenta está desactivada" });
    }

    return done(null, user);
  } catch (error) {
    done(error, false, { message: "User not found" });
  }
});

passport.use(jwtLogin);
passport.use(localLogin);
