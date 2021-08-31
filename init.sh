echo "Initiating project..."
FILE=./api/auth/id_rsa_priv.pem
if [[ -f "$FILE" ]]; then
  echo "Keypairs have already been generated!"
else
  echo "Generating keypairs..."
  node ./api/auth/generateKeypair.js
fi

echo "Building Docker containers..."
docker-compose -f development.yml build
echo "Launching services..."
docker-compose -f development.yml up
echo "You're all good to go!!!"