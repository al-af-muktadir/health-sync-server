import jwt, { JwtPayload, Secret } from "jsonwebtoken";
const generateToken = (payload: any, secret: any, expiresIn: any) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtEncoded = {
  generateToken,
  verifyToken,
};
