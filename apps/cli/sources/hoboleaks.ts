export async function getHoboleaksFile(filename: string) {
  const url = `https://sde.hoboleaks.space/tq/${filename}`;
  const data = await fetch(url);

  if (!data.ok) {
    throw new Error(`Failed to fetch ${url}: ${data.statusText}`);
  }

  return await data.json();
}
