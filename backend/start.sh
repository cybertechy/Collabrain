#!/bin/bash

while true; do
  yarn --max-old-space-size=100 start
  if [ $? -ne 0 ]; then
    echo "Application exited with status $? at $(date). Restarting..."
    sleep 5  # Optional: wait for 5 seconds before restarting
  fi
done
