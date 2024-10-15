import type {AuthUser} from './providers/auth';

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

export type ErrorResponce ={
  type: string;
  message: string;
  issues: [//not this is just to make type script happy in login form. note: this may not be the struture of a diffrent validarion error
    {
      name: "email"|"password";
      errors: [string];
    }
  ];
}

export class RestClient {
  #token: string | null;
  #BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
  #on401: (res: Response) => void | Promise<void> | boolean | Promise<boolean>;

  constructor(
    token: string | null,
    on401: (res: Response) => void | Promise<void> | boolean | Promise<boolean>
  ) {
    this.#token = token;
    this.#on401 = on401;
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{token: string}> {
    return this.#wrap(
      fetch(this.#buildURL('login'), {
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
      fetch(this.#buildURL('sign-up'), {
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
      fetch(this.#buildURL('user'), {
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
      fetch(
        this.#buildURL('clubs', clubID, 'club-days', clubDayID, 'attendees'),
        {
          headers: this.#getHeaders(),
        }
      )
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

  async getClubDayQRToken(
    clubID: number,
    clubDayID: number
  ): Promise<{token: string}> {
    return this.#wrap(
      fetch(
        this.#buildURL('clubs', clubID, 'club-days', clubDayID, 'qr-token'),
        {
          headers: this.#getHeaders(),
        }
      )
    ).then(r => r?.json());
  }

  async getClubs(): Promise<Club[]> {
    return this.#wrap(
      fetch(this.#buildURL('clubs'), {
        headers: this.#getHeaders(),
      })
    ).then(res => res?.json());
  }

  async getClubAdmins(clubID: number): Promise<AuthUser[]> {
    return this.#wrap(
      fetch(this.#buildURL('clubs', clubID, 'admins'), {
        headers: this.#getHeaders(),
      })
    ).then(r => r?.json());
  }

  async searchUsers(searchWords: string): Promise<AuthUser[]> {
    return this.#wrap(
      fetch(this.#buildURL('user', 'search'), {
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

  async addClubAdmin(clubId: number, userId: number) {
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

  async removeClubAdmin(clubId: number, userId: number) {
    return this.#wrap(
      fetch(this.#buildURL('clubs', clubId, 'admins', userId), {
        method: 'DELETE',
        headers: {
          ...this.#getHeaders(),
        },
      })
    ).then(r => r?.json());
  }

  async getAllClubs() {
    return this.#wrap(
      fetch(this.#buildURL('clubs'), {
        headers: this.#getHeaders(),
      })
    ).then(r => r?.json());
  }

  async createClub(name: string) {
    return this.#wrap(
      fetch(this.#buildURL('clubs'), {
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

  async deleteClub(clubID: number) {
    return this.#wrap(
      fetch(this.#buildURL('clubs', clubID), {
        method: 'DELETE',
        headers: this.#getHeaders(),
      })
    ).then(d => d?.json());
  }

  async getAllUsers(): Promise<AuthUser[]> {
    return this.#wrap(
      fetch(this.#buildURL('users'), {
        headers: this.#getHeaders(),
      })
    ).then(r => r?.json());
  }

  async makeServiceAdmin(id: number) {
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
    );
  }

  async removeServiceAdmin(id: number) {
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
    );
  }
  
  async getClubNameFromCode(code: string){
	return this.#wrap(
		fetch(this.#buildURL('check-code',code))
		
	).then(r => r?.json());
  }
  
  async getUserCheckedIn(code: string){
    return this.#wrap(
		fetch(this.#buildURL('check-code',code),{
		  method: 'POST',
          headers: {
            ...this.#getHeaders(),
          },
        })
	).then(r => r?.json());
  }
  
  async checkIn(code: string){
	return this.#wrap(
		fetch(this.#buildURL('check-in'),{
			method: 'POST',
			body: JSON.stringify({
				code: code,
			}),
			headers: {
			...this.#getHeaders(),
			'content-type': 'application/json',
			},
		})
	)
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
		//if the error responce is json then extract the json to put into the exeception
		const contentType = clonedRes.headers.get("Content-Type");
	  if(contentType && contentType.includes("application/json")){
		await clonedRes.json().then(json =>{
			//console.log("JSON");
			throw new RestError(clonedRes.statusText, clonedRes.status, json);
		});
	  
	  }else{
		throw new RestError(clonedRes.statusText, clonedRes.status, clonedRes);
	  }
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
    parts.unshift('api');
    return new URL(parts.join('/'), this.#BASE_URL);
  }
}

export class RestError extends Error {
  constructor(
    readonly message: string,
    readonly code: number,
    readonly res: Response | ErrorResponce
  ) {
    super(message);
  }
}
