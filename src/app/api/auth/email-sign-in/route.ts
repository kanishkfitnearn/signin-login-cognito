import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse, type NextRequest } from "next/server";
import * as crypto from "crypto";

const { NEXT_PUBLIC_APP_CLIENT_ID, NEXT_PUBLIC_APP_CLIENT_SECRET, AWS_REGION } = process.env;

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

function generateSecretHash(email: string): string {
  const secret = NEXT_PUBLIC_APP_CLIENT_SECRET as string;
  const clientId = NEXT_PUBLIC_APP_CLIENT_ID as string;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(email + clientId);
  return hmac.digest("base64");
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const secretHash = generateSecretHash(email);

    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: NEXT_PUBLIC_APP_CLIENT_ID as string,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    });

    const response = await client.send(command);

    return NextResponse.json({ message: "Sign-in successful!", response });
    
  } catch (error) {
    console.error("Error during sign-in:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
