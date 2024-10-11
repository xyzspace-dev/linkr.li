import {
  createCookie,
  createSession,
  createUser,
  getLinks,
  getSession,
  getUser,
  updateUser,
} from "@/backend/actions";
import {
  DISCORD_CLIENTID,
  DISCORD_CLIENTSECRET,
  DISCORD_REDIRECTURI,
} from "@/config.json";
const DiscordOauth2 = require("discord-oauth2");
const { v4: uuidv4 } = require("uuid");
const uuids = uuidv4();

export async function GET(req: Request) {
  const code = req.url.split("?code=")[1];
  const oauth = new DiscordOauth2();

  const data = await oauth.tokenRequest({
    clientId: DISCORD_CLIENTID, // This is a fake client ID
    clientSecret: DISCORD_CLIENTSECRET, // This is a fake secret

    code: code,
    scope: "identify guilds",
    grantType: "authorization_code",

    redirectUri: DISCORD_REDIRECTURI,
  });

  const member = await oauth.getUser(data.access_token);
  const user = await getUser(member.id);

  if (!user) {
    await createUser(
      member.id,
      member.email,
      data.refresh_token,
      data.access_token
    );
  }

  if (user) {
    await updateUser(
      member.id,
      data.access_token,
      data.refresh_token,
      member.email
    );
  }

  await createSession(member.id, uuids);
  await createCookie(uuids);

  return Response.redirect(new URL("/dashboard", req.url));
}
