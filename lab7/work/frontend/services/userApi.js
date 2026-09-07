const API_BASE_URL = "http://localhost:3000/api";

async function fetchUsers(parity) {
  const response = await fetch(`${API_BASE_URL}/users/${parity}`);

  if (!response.ok) {
    throw new Error(`The ${parity} user request failed.`);
  }

  return response.json();
}

export function getEvenUsers() {
  return fetchUsers("even");
}

export function getOddUsers() {
  return fetchUsers("odd");
}
