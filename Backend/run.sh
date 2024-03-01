# npm install

# node --env-file=.env app.js port=4242



docker build --pull --rm -f "DOCKERFILE" -t devguidenodebackendapi:latest "."
docker tag devguidenodebackendapi:latest dgg65pjtrinv3fmregistry.azurecr.io/devguidenodebackendapi:v3
docker push dgg65pjtrinv3fmregistry.azurecr.io/devguidenodebackendapi:v3

az containerapp up --name dgg65pjtrinv3fm-api --image dgg65pjtrinv3fmregistry.azurecr.io/devguidenodebackendapi:v3 --resource-group mongo-devguide-rg --environment mongo-devguide-containerappenv --ingress external
