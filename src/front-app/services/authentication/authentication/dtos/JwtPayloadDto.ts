export default interface JwtPayload {
  // Default
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  // Custom
  id: string;
  birthdate: string;
  unique_name: string;
}