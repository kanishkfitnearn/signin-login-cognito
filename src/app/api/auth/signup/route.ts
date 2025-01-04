import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse, type NextRequest } from "next/server";
import * as crypto from 'crypto'; // To compute HMAC-SHA256 hash

const { NEXT_PUBLIC_APP_CLIENT_ID, NEXT_PUBLIC_APP_CLIENT_SECRET, AWS_REGION } = process.env;

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

// Function to generate SECRET_HASH
function generateSecretHash(email: string): string {
  const secret = NEXT_PUBLIC_APP_CLIENT_SECRET as string;
  const clientId = NEXT_PUBLIC_APP_CLIENT_ID as string;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(email + clientId);
  return hmac.digest('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Generate the SECRET_HASH for the given email
    const secretHash = generateSecretHash(email);

    // Create the SignUpCommand to create a new user
    const command = new SignUpCommand({
      ClientId: NEXT_PUBLIC_APP_CLIENT_ID as string,
      Username: email,
      Password: password,
      SecretHash: secretHash, // Include the SECRET_HASH in the request
    });

    // Send the command to AWS Cognito
    const response = await client.send(command);

    return NextResponse.json({ message: "User created successfully!", response });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error during user creation:", error);

    // Check for specific AWS Cognito errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If error is not of type Error, send a generic message
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
