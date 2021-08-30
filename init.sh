echo "Initiating project..."
FILE=./api/auth/id_rsa_priv.pem
DIR=./api/node_modules
if [[ -f "$FILE" ]]; then
  echo "Keypairs have already been generated!"
else
  echo "Generating keypairs..."
  node ./api/auth/generateKeypair.js
fi

if [[ -d "$DIR" ]]; then
  echo "Removing api/node_modules..."
  cd api && rm -rf node_modules && cd ..
fi
echo "Building Docker containers..."
docker-compose build
echo "Launching services..."
docker-compose up
echo "You're all good to go!!!"