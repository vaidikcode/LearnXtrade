echo "Starting client..."
cd client
npm install
npm run dev &
CLIENT_PID=$!
cd ..

echo "Starting server..."
cd server
npm install
npm run run-it &
SERVER_PID=$!
cd ..

echo "Starting calculate service..."
cd calculate
go run main.go &
CALC_PID=$!
cd ..

echo "All services started."
echo "Client PID: $CLIENT_PID"
echo "Server PID: $SERVER_PID"
echo "Calculate PID: $CALC_PID"

wait $CLIENT_PID $SERVER_PID $CALC_PID