const config = require("../config");
import { Strategy, Issuer } from "openid-client";

const getPassportStrategy = async logger => {
  const issuer = await Issuer.discover(config.identifyingParty.url);

  const client = new issuer.Client({
    client_id: config.identifyingParty.clientId,
    client_secret: config.identifyingParty.clientSecret,
    token_endpoint_auth_method: "client_secret_post"
  });

  if (config.identifyingParty.clockTolerance && config.identifyingParty.clockTolerance > 0) {
    client.CLOCK_TOLERANCE = config.identifyingParty.clockTolerance;
  }

  return new Strategy(
    {
      client,
      params: {
        redirect_uri: `${config.hostingEnvironment.protocol}://${config.hostingEnvironment.host}:${
          config.hostingEnvironment.port
        }/auth/cb`,
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
