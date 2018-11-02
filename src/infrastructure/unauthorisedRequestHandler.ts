export default function unauthorisedRequestHandler(err, req, res, next) {
  if (err && err.httpCode === 401) {
    res.redirect("/auth/login");
  } else {
    next();
  }
}
