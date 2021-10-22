rm -r api/public
cd client
yarn build
mv build ../api/public
cd ../api 
go build -o server
