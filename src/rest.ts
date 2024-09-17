import {AuthUser} from './providers/auth';

export type ClubDay = {
  attendees: number;
  startsAt: string;
  endsAt: string;
  id: number;
};

export type Club = {
  id: number;
  name: string;
};

export class RestClient {
  #token: string | null;
  #BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
  #on401: (res: Response) => void | Promise<void> | boolean | Promise<boolean>;
  selectedClubId: number;
  hadClubs: boolean;

  constructor(
    token: string | null,
    on401: (res: Response) => void | Promise<void> | boolean | Promise<boolean>
  ) {
    this.#token = token;
    this.#on401 = on401;
	  this.selectedClubId = -1;
	  this.hadClubs = false;
  }

  setSelectedClub(id: number){
    this.selectedClubId = Number(id)
  }

  getSelectedClub(){
    return this.selectedClubId;
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{token: string}> {
    return this.#wrap(
      fetch(this.#BASE_URL + '/login', {
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      false
    ).then(r => r?.json());
  }

  async signUp({
    email,
    password,
    firstName,
    lastName,
  }: {
    [key in 'email' | 'password' | 'firstName' | 'lastName']: string;
  }): Promise<{token: string}> {
    return this.#wrap(
      fetch(this.#BASE_URL + '/sign-up', {
        method: 'POST',
        body: JSON.stringify({email, password, firstName, lastName}),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      false
    ).then(r => r?.json());
  }

  async getUser() {
    return this.#wrap(
      fetch(this.#BASE_URL + '/user', {
        headers: this.#getHeaders(),
      })
    ).then(res => res?.json());
  }

  async getClubDays(clubID: number): Promise<ClubDay[]> {
    // TODO: get rid of selectedclubid
    return this.#wrap(
      fetch(this.#buildURL('clubs', clubID, 'club-days'), {
        headers: this.#getHeaders(),
      })
    ).then(r => r?.json());
  }

  async getAttendees(clubID: number, clubDayID: number): Promise<AuthUser[]> {
    return this.#wrap(
      fetch(this.#buildURL('clubs', clubID, 'club-days', clubDayID, 'attendees'), {
        headers: this.#getHeaders(),
      })
    ).then(r => r?.json());
  }

  async deleteClubDay(clubID: number, clubDayID: number): Promise<ClubDay> {
    return this.#wrap(
      fetch(this.#buildURL('clubs', clubID, 'club-days', clubDayID), {
        method: 'DELETE',
        headers: this.#getHeaders(),
      })
    ).then(d => d?.json());
  }

  async createClubDay(clubID: number, start: Date, end: Date) {
    return this.#wrap(
      fetch(this.#buildURL('clubs', clubID, 'club-days'), {
        method: 'POST',
        body: JSON.stringify({
          startsAt: start.toISOString(),
          endsAt: end.toISOString(),
        }),
        headers: {
          ...this.#getHeaders(),
          'content-type': 'application/json',
        },
      })
    ).then(r => r?.json());
  }

  async getClubDayQRToken(clubID: number, clubDayID: number): Promise<{token: string}> {
    return this.#wrap(
      fetch(this.#buildURL('clubs', clubID, 'club-days', clubDayID, 'qr-token'), {
        headers: this.#getHeaders(),
      })
    ).then(r => r?.json());
  }

  async getClubs(): Promise<Club[]> {
	 return this.#wrap(
      fetch(this.#buildURL('clubs'), {
        headers: this.#getHeaders(),
      })
    ).then(res => res?.json());
  }

  async hasClubs(){
    const clubs = await this.getClubs();
    if(!clubs || clubs.length == 0){
      this.hadClubs = false;
      return false;
    }
    if(this.selectedClubId==-1){
      this.selectedClubId = clubs[0].id;
    }
    this.hadClubs=true;
    return true;
  }

  getHadClubs(){
	 return this.hadClubs;
  }

  async getClubAdmins(clubID: number): Promise<AuthUser[]>{
    return this.#wrap(
      fetch(this.#buildURL('clubs', clubID, 'admins'), {
        headers: this.#getHeaders(),
      })
    ).then(r => r?.json());
  }

  async searchUsers(searchWords: string): Promise<AuthUser[]>{
    return this.#wrap(
      fetch(this.#BASE_URL + '/user/search', {
        method: 'POST',
        body: JSON.stringify({
          querey: searchWords,
        }),
        headers: {
          ...this.#getHeaders(),
          'content-type': 'application/json',
        },
      })
      ).then(r => r?.json());
  }

  async addClubAdmin(clubId: number, userId: number){
    return this.#wrap(
      fetch(this.#buildURL('clubs', clubId, 'admins'), {
        method: 'POST',
        body: JSON.stringify({
          userId,
        }),
        headers: {
          ...this.#getHeaders(),
          'content-type': 'application/json',
        },
      })
      ).then(r => r?.json());
  }

  async removeClubAdmin(clubId: number, userId: number){
    return this.#wrap(
      fetch(this.#buildURL('clubs', clubId, 'admins'), {
        method: 'DELETE',
        body: JSON.stringify({
          userId,
        }),
        headers: {
          ...this.#getHeaders(),
          'content-type': 'application/json',
        },
      })
      ).then(r => r?.json());
  }

  async getAllClubs(){
    return this.#wrap(
      fetch(this.#BASE_URL + `/clubs`, {
        headers: this.#getHeaders(),
      })
      ).then(r => r?.json());
  }

  async createClub(name: string){
    return this.#wrap(
      fetch(this.#BASE_URL + '/clubs', {
        method: 'POST',
        body: JSON.stringify({
          name: name,
        }),
        headers: {
          ...this.#getHeaders(),
          'content-type': 'application/json',
        },
      })
      ).then(r => r?.json());
  }

  async deleteClub(clubID: number){
    return this.#wrap(
      fetch(this.#buildURL('clubs', clubID), {
        method: 'DELETE',
        headers: this.#getHeaders(),
      })
      ).then(d => d?.json());
  }

  async getAllUsers(): Promise<AuthUser[]>{
    return this.#wrap(
      fetch(this.#buildURL('users'), {
        headers: this.#getHeaders(),
      })
      ).then(r => r?.json());
  }

  async makeServiceAdmin(id: number){
    return this.#wrap(
      //fetch(this.#BASE_URL + '/user/addadmin', {
      fetch(this.#buildURL('users', id), {
        method: 'PATCH',
        body: JSON.stringify({
          service_admin: true,
        }),
        headers: {
          ...this.#getHeaders(),
          'content-type': 'application/json',
        },
      })
      ).then(r => r?.json());
  }

  async removeServiceAdmin(id: number){
    return this.#wrap(
      fetch(this.#buildURL('users', id), {
        method: 'PATCH',
        body: JSON.stringify({
          service_admin: false,
        }),
        headers: {
          ...this.#getHeaders(),
          'content-type': 'application/json',
        },
      })
      //fetch(this.#BASE_URL + '/user/removeadmin', {
      //  method: 'POST',
      //  body: JSON.stringify({
      //    userId: id,
      //  }),
      //  headers: {
      //    ...this.#getHeaders(),
      //    'content-type': 'application/json',
      //  },
      //})
      ).then(r => r?.json());
  }



  /**
   * Maps any error to a RestError, and optionally runs a function if the API returns 401
   *
   * If the api returns a status 401 (the token is invalid or not present), this will run the `on401` callback to log out the user.
   */
  async #wrap(res: Promise<Response>, checkAuth = true) {
    const clonedRes = await res.then(r => r.clone());

    if (!clonedRes.ok) {
      if (checkAuth && clonedRes.status === 401) {
        const shouldContinue = await this.#on401(clonedRes);

        if (shouldContinue === false) {
          return;
        }
      }

      throw new RestError(clonedRes.statusText, clonedRes.status, clonedRes);
    }

    return res;
  }

  #getHeaders(): Record<string, string> {
    return this.#token ? {Authorization: this.#token} : {};
  }

  /**
   * Safely build a URL from parts
   */
  #buildURL(...parts: (string | number)[]) {
    return new URL(parts.join('/'), this.#BASE_URL);
  }
}

export class RestError extends Error {
  constructor(
    readonly message: string,
    readonly code: number,
    readonly res: Response
  ) {
    super(message);
  }
}
