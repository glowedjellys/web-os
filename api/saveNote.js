export default async function handler(req, res) {
  const { note } = req.body;
  // Save to database or file (mocked here)
  console.log('Note saved:', note);
  res.status(200).json({ status: 'saved' });
}
