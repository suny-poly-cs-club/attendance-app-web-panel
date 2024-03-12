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
	  this.selectedClubId = -	1;
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

  async getClubDays(): Promise<ClubDay[]> {
    return this.#wrap(
      fetch(this.#BASE_URL + '/club-days?clubId='+this.selectedClubId, {
        headers: this.#getHeaders(),
      })
    ).then(r => r?.json());
  }

  async getAttendees(id: number): Promise<AuthUser[]> {
    return this.#wrap(
      fetch(this.#BASE_URL + `/club-days/${id}/attendees?clubId=`+this.selectedClubId, {
        headers: this.#getHeaders(),
      })
    ).then(r => r?.json());
  }

  async deleteClubDay(id: number): Promise<ClubDay> {
    return this.#wrap(
      fetch(this.#BASE_URL + `/club-days/${id}?clubId=`+this.selectedClubId, {
        method: 'DELETE',
        headers: this.#getHeaders(),
      })
    ).then(d => d?.json());
  }

  async createClubDay(start: Date, end: Date) {
    return this.#wrap(
      fetch(this.#BASE_URL + '/club-days', {
        method: 'POST',
        body: JSON.stringify({
          startsAt: start.toISOString(),
          endsAt: end.toISOString(),
          clubId: this.selectedClubId,
        }),
        headers: {
          ...this.#getHeaders(),
          'content-type': 'application/json',
        },
      })
    ).then(r => r?.json());
  }

  async getClubDayQRToken(id: number): Promise<{token: string}> {
    return this.#wrap(
      fetch(this.#BASE_URL + `/club-days/${id}/qr-token?clubId=`+this.selectedClubId, {
        headers: this.#getHeaders(),
      })
    ).then(r => r?.json());
  }

  async getClubs(): Promise<Club[]> {
	 return this.#wrap(
      fetch(this.#BASE_URL + '/club', {
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

  async getClubAdmins(): Promise<AuthUser[]>{
    return this.#wrap(
      fetch(this.#BASE_URL + `/club/admins/`+this.selectedClubId, {
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

  async addClubAdmin(userId: number){
    return this.#wrap(
      fetch(this.#BASE_URL + '/club/addadmin', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          clubId: this.selectedClubId,
        }),
        headers: {
          ...this.#getHeaders(),
          'content-type': 'application/json',
        },
      })
      ).then(r => r?.json());
  }

  async removeClubAdmin(userId: number){
    return this.#wrap(
      fetch(this.#BASE_URL + '/club/removeadmin', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          clubId: this.selectedClubId,
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
      fetch(this.#BASE_URL + `/clubsa`, {
        headers: this.#getHeaders(),
      })
      ).then(r => r?.json());
  }

  async createClub(name: string){
    return this.#wrap(
      fetch(this.#BASE_URL + '/clubsa', {
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

  async deleteClub(id: number){
    return this.#wrap(
      fetch(this.#BASE_URL + `/clubsa/${id}`, {
        method: 'DELETE',
        headers: this.#getHeaders(),
      })
      ).then(d => d?.json());
  }

  async getAllUsers(){
    return this.#wrap(
      fetch(this.#BASE_URL + `/user/all`, {
        headers: this.#getHeaders(),
      })
      ).then(r => r?.json());
  }

  async makeServiceAdmin(id: number){
    return this.#wrap(
      fetch(this.#BASE_URL + '/user/addadmin', {
        method: 'POST',
        body: JSON.stringify({
          userId: id,
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
      fetch(this.#BASE_URL + '/user/removeadmin', {
        method: 'POST',
        body: JSON.stringify({
          userId: id,
        }),
        headers: {
          ...this.#getHeaders(),
          'content-type': 'application/json',
        },
      })
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
