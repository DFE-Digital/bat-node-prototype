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
        redirect_uri: `https://${process.env.BAT_NODE_HOST}:${process.env.PORT}/auth/cb`,
        scope: "openid profile email offline_access"
      }
    },
    async (tokenset, authUserInfo, done) => {
      try {
        const userInfo = await client.userinfo(tokenset.access_token);
        userInfo.access_token = tokenset.access_token;
        done(null, userInfo);
      } catch (err) {
        logger.error(err);
        done(err);
      }
    }
  );
};

export { getPassportStrategy };
