import { getAuthCode, getLinkfromAPI } from "@/backend/actions";

export async function GET(req: Request) {
  const authcode = req.headers.get("Authorization");
  const slug = req.headers.get("Slug");

  if (!slug) {
    return new Response(
      JSON.stringify({
        error: "No slug provided",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (!authcode) {
    return new Response(
      JSON.stringify({
        error: "No auth code provided",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const isKey = await getAuthCode(authcode);

  if (!isKey) {
    return new Response(
      JSON.stringify({
        error: "Invalid auth code",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const data = await getLinkfromAPI(slug, authcode);

    if (!data) {
      return new Response(
        JSON.stringify({
          error: "No data found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        data: data,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: "An error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
