async function getAll(req, res) {
  console.log(req.jwt)
  res.status(200).json({ success: true, msg: 'You are authorized!' })
}

module.exports = {
  getAll,
}
