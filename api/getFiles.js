export default async function handler(req, res) {
  const files = ['file1.txt', 'file2.txt'];
  res.status(200).json({ files });
}
