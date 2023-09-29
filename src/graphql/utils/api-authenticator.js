import { getCookie, setCookie } from "cookies-next"
import axios from "axios";
import config from "../index";

export class APIAuthenticator {
  _client
  _config

  constructor(
    client,
    config
  ) {
    this._client = client
    this._config = config
  }

  _calculateTicketExpiration(ticket) {
    const millisecsUntilExpiration =
      ticket.ticket.expiresIn * 1000
    ticket.ticket.expiresAt = Date.now() + millisecsUntilExpiration
    return ticket
  }

  async authenticate() {

    const res = await axios({
      url: config.commerceURL,
      method: "post",
      data: {
        query: `mutation createAnonymousAuthentication {
          anonymousAuthentication { 
            accessToken
            expiresIn
            sessionId
            } 
          }`
      },
      variables: {}
    })
      if (!res.data) throw 'Failed to create authentication'
      
      const ticket = this.normalizeAuthTicket(res.data.data);

      this._calculateTicketExpiration(ticket)
      this.setAuthCookie(ticket)
      
      return ticket
    
  }

  async getAccessToken() {
    const ticket = await this.getOrCreateAuthCookie();
    return ticket?.ticket?.accessToken
  }

  async getSessionIdOrIdToken() {
    const ticket = await this.getOrCreateAuthCookie(); 
    return ticket?.ticket?.sessionId ?? ticket?.ticket?.idToken;
  }

  async getOrCreateAuthCookie() {
    let authTicket = this.getAuthCookie()

    if (!authTicket || authTicket.ticket?.expiresAt < Date.now()) {
      authTicket = await this.authenticate()
    }

    return authTicket;
  }

  getAuthCookie() {
    const customerCookie = getCookie(config.customerCookie)
    const authCookie = getCookie(config.authCookieName)
    if(customerCookie) {
      return this.normalizeAuthTicket(JSON.parse(customerCookie))
    } else if (authCookie) {
      return this.normalizeAuthTicket(JSON.parse(authCookie))
    }
    return undefined
  }

  setAuthCookie(ticket) {
    setCookie(config.authCookieName, JSON.stringify(ticket))
  }

  // getCookie(name) {
  //   return getCookie(name/* , {
  //     req: this.
  //     .request,
  //     res: this.
  //     .response,
  //   } */)
  // }

  // setCookie(name, value) {
  //   setCookie(name, value);
  // }

  normalizeAuthTicket(ticket) {
    let normTicket = {
      authType: ticket.authType ?? "anon",
      ticket: {
        accessToken: ticket.anonymousAuthentication?.accessToken || ticket.ticket.accessToken,
        expiresIn: ticket.anonymousAuthentication?.expiresIn || ticket.ticket.expiresIn,
        expiresAt: Date.now() + ticket.anonymousAuthentication?.expiresIn * 1000 || ticket.ticket.expiresAt,
        sessionId: ticket.anonymousAuthentication?.sessionId || ticket.ticket.sessionId,
        idToken: ticket.login?.idToken ?? undefined,
      }
    }
    return normTicket;
  }
}