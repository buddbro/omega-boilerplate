const jsonwebtoken = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const pathToPrivateKey = path.join(
  __dirname,
  '..',
  '..',
  'auth',
  'id_rsa_priv.pem'
)
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, 'utf8')
const pathToPublicKey = path.join(
  __dirname,
  '..',
  '..',
  'auth',
  'id_rsa_pub.pem'
)
const PUB_KEY = fs.readFileSync(pathToPublicKey, 'utf8')

function issueJWT(user) {
  const id = user.id
  const expiresIn = '2w'

  const payload = {
    sub: id,
    iat: Date.now(),
  }

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: 'RS256',
  })

  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn,
  }
}

function parseToken(authorizationHeader) {
  const tokenParts = authorizationHeader.split(' ')

  if (
    tokenParts &&
    tokenParts.length > 1 &&
    tokenParts[0] === 'Bearer' &&
    tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
  )
    return tokenParts[1]
  return null
}

function authMiddleware(req, res, next) {
  if (req.headers.authorization) {
    const token = parseToken(req.headers.authorization)

    if (!token) {
      res.status(401).json({ success: false, msg: 'Not a valid token.' })
    }

    const verification = jsonwebtoken.verify(token, PUB_KEY, {
      algorithms: ['RS256'],
    })

    req.jwt = verification
    next()
  } else {
    res.status(401).json({ success: false, msg: 'Not a valid token.' })
  }
}

module.exports = {
  issueJWT,
  authMiddleware,
}
