export const isLoggedIn = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      return next();
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

export const isLoggedOut = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      return res.redirect("/home");
    } else {
      return next();
    }
  } catch (error) {
    console.log(error);
  }
};
