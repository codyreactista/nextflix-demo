import { SignJWT } from "jose";

import { setTokenCookie } from "@/lib/cookies";
import { createNewUser, isNewUser } from "@/lib/db/hasura";
import { magicAdmin } from "@/lib/magic";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : "";

      const metadata = await magicAdmin.users.getMetadataByToken(didToken);

      const encoder = new TextEncoder();
      const secret = encoder.encode(process.env.JWT_SECRET);

      const token = await new SignJWT({
        ...metadata,
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user", "admin"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": `${metadata.issuer}`,
        },
      })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);

      const isNewUserQuery = await isNewUser(token, metadata.issuer);
      isNewUserQuery && (await createNewUser(token, metadata));

      setTokenCookie(token, res);
      res.send({ done: true });
    } catch (error) {
      console.error("Something went wrong logging in", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
