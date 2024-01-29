import { NextResponse, NextRequest } from "next/server";
import {
  comparePassword,
  generateToken,
  findUserByEmail,
  User,
} from "../../utils/authUtils";

import { SignJWT, generateKeyPair } from "jose";
// import { fromKeyLike } from "jose/jwk/from_key_like";

export async function POST(request: NextRequest) {
  // const loginHandler = async (req: NextRequest) => {
  const body = await request.json();
  const { email, password } = body;

  // Find user by email
  const user: User | null = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ response: "user Not Found!" }, { status: 404 });
  }

  // Compare password with stored hash
  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    return NextResponse.json(
      { response: "Authentication failed!" },
      { status: 401 }
    );
  }

  //create token data
  const tokenData = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  // This should be securely stored, not in your source code
  // const privateKeyJwk = {
  //   kty: "oct",
  //   k: process.env.JWT_SECRET_KEY,
  // };

  // Generating a new key for this example, you'd typically store this securely
  // const { privateKey } = await generateKeyPair("RS2÷56");
  const privateKey: string = process.env.JWT_SECRET || "";
  console.log("privateKey--->", privateKey);
  // const parsedKey = await parse(privateKey);

  const token = await new SignJWT({ tokenData })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(privateKey);

  // Generate a JWT token
  // const token = generateToken(tokenData);

  // Return the token
  const response = NextResponse.json({
    message: "Login successful",
    success: true,
    token,
  });
  response.cookies.set("token", token, {
    httpOnly: true,
  });
  return response;
}
