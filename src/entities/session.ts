export default class Session {
  sessionId: string;

  clientId: string;

  refreshToken: string;

  expiresIn: Date;

  constructor(
    sessionId: string,
    clientId: string,
    refreshToken: string,
    expiresIn: Date,
  ) {
    this.sessionId = sessionId;
    this.clientId = clientId;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
  }
}
