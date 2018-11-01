import { Strategy, Issuer } from "openid-client";

const getPassportStrategy = async logger => {
  const issuer = await Issuer.discover(process.env.BAT_NODE_SIGNIN_URL);

  const client = new issuer.Client({
    client_id: process.env.BAT_NODE_SIGNIN_CLIENT_ID,
    client_secret: process.env.BAT_NODE_SIGNIN_CLIENT_SECRET,
    token_endpoint_auth_method: "client_secret_post"
  });

  return new Strategy(
    {
      client,
      params: {
        redirect_uri: `https://${process.env.BAT_NODE_HOST}:${process.env.BAT_NODE_PORT}/auth/cb`,
        scope: "openid profile email offline_access"
      }
    },
    (tokenset, authUserInfo, done) => {
      client
        .userinfo(tokenset.access_token)
        .then(userInfo => {
          done(null, userInfo);
        })
        .catch(err => {
          logger.error(err);
          done(err);
        });
    }
  );
};

export { getPassportStrategy };
