#!/bin/sh

# Define variables
host="localhost"
port=$PORT
max_retries=60
retry_interval=1

# Wait for server to start
count=0
while [ $count -lt $max_retries ]; do
  echo "Waiting for server to start..."
  if nc -z $host $port; then
    echo "Server started!"
    exit 0
  fi
  count=$((count+1))
  sleep $retry_interval
done

echo "Server failed to start after $max_retries retries."
exit 1
