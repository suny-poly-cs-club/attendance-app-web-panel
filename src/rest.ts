import {AuthUser} from './providers/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const login = async (email: string, password: string) => {
  console.log(BASE_URL);

  const res = await fetch(BASE_URL + '/login', {
    method: 'POST',
    body: JSON.stringify({email, password}),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const body = await res.json();
  if (res.ok) {
    return body;
  }

  throw new Error(body.message);
};

export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: {
  [key in 'email' | 'password' | 'firstName' | 'lastName']: string;
}): Promise<{token: string}> => {
  console.log(BASE_URL);

  // const email = 'ben@owo.ceo';
  // const password = 'owo';
  // const firstName = 'Ben';
  // const lastName = 'Richeson';

  const res = await fetch(BASE_URL + '/sign-up', {
    method: 'POST',
    body: JSON.stringify({email, password, firstName, lastName}),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const body = (await res.json()) as {token: string} | {message: string};

  if (res.ok) {
    if ('token' in body) {
      return {token: body.token};
    }

    throw new Error('Did not get token');
  } else {
    throw new Error((body as {message: string}).message);
  }
};

export const getUser = async (token: string) => {
  const res = await fetch(BASE_URL + '/user', {
    method: 'GET',
    headers: {
      authorization: token!,
    },
  });

  return res.json();
};

export type ClubDay = {
  attendees: number;
  starts_at: string;
  ends_at: string;
  id: number;
};

export const getClubDays = async (token: string): Promise<ClubDay[]> => {
  const res = await fetch(BASE_URL + '/club-days', {
    method: 'GET',
    headers: {
      authorization: token!,
    },
  });

  return res.json();
};

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

  async getUser() {
    console.log('getting user');
    return this.#authenticated(
      fetch(this.#BASE_URL + '/user', {
        headers: this.#getHeaders(),
      })
    ).then(res => res?.json());
  }

  async getClubDays(): Promise<ClubDay[]> {
    return this.#authenticated(
      fetch(this.#BASE_URL + '/club-days', {
        headers: this.#getHeaders(),
      })
    ).then(r => r?.json());
  }

  async getAttendees(id: number): Promise<AuthUser[]> {
    return this.#authenticated(
      fetch(this.#BASE_URL + `/club-days/${id}/attendees`, {
        headers: this.#getHeaders(),
      })
    ).then(r => r?.json());
  }

  async deleteClubDay(id: number): Promise<ClubDay> {
    return this.#authenticated(
      fetch(this.#BASE_URL + `/club-days/${id}`, {
        method: 'DELETE',
        headers: this.#getHeaders(),
      })
    ).then(d => d?.json());
  }

  async createClubDay(start: Date, end: Date) {
    return this.#authenticated(
      fetch(this.#BASE_URL + '/club-days', {
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

  /**
   * Ensures that the auth token is valid.
   *
   * If the api returns a status 401 (the token is invalid or not present), this will run the `on401` callback to log out the user.
   */
  async #authenticated(res: Promise<Response>) {
    const clonedRes = await res.then(r => r.clone());

    if (!clonedRes.ok) {
      if (clonedRes.status === 401) {
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
