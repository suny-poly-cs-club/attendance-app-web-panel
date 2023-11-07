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

export const signUp = async (
  {email, password, firstName, lastName}: {
    [key in 'email' | 'password' | 'firstName' | 'lastName']: string;
  }
): Promise<{token: string}> => {
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
