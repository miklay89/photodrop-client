export default class User {
  clientId: string;

  phone: string;

  selfieId: string | null;

  email: string | null;

  fullName: string | null;

  constructor(
    clientId: string,
    phone: string,
    selfieId?: string,
    email?: string,
    fullName?: string,
  ) {
    this.clientId = clientId;
    this.phone = phone;
    this.selfieId = selfieId || null;
    this.email = email || null;
    this.fullName = fullName || null;
  }
}
