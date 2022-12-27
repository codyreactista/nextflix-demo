import { jwtVerify } from "jose";

export async function verifyToken(token) {
  try {
    if (token) {
      const encoder = new TextEncoder();
      const secret = encoder.encode(process.env.JWT_SECRET);

      const verified = await jwtVerify(token, secret);

      return verified.payload && verified.payload?.issuer;
    }

    return null;
  } catch (err) {
    console.error({ err });
    return null;
  }
}
