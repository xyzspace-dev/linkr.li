import {
  createCookie,
  createSession,
  createUser,
  deleteSession,
  getLinks,
  getSession,
  getUser,
  updateUser,
} from "@/backend/actions";
import {
  DISCORD_CLIENTID,
  DISCORD_CLIENTSECRET,
  DISCORD_REDIRECTURI,
} from "@/config";
const DiscordOauth2 = require("discord-oauth2");
const { v4: uuidv4 } = require("uuid");
async function genuuid() {
  return uuidv4();
}

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

  let member = await oauth.getUser(data.access_token);
  let user = await getUser(member.id);

  if (process.env.NEXTLOGINOPEN == "false") {
    if (process.env.ADMINID == member.id) {
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
      const uuids = await genuuid();

      await createSession(member.id, await uuids);
      await createCookie(await uuids);

      return Response.redirect(new URL("/dashboard", process.env.NEXTAPP_URL));
    } else {
      return new Response(
        JSON.stringify({
          error: "You are not authorized to access this page",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
  const uuids = await genuuid();
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

  await deleteSession(member.id);
  await createSession(member.id, uuids);
  await createCookie(uuids);

  return Response.redirect(new URL("/dashboard", process.env.NEXTAPP_URL));
}
