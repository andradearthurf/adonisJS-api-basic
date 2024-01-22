#!/bin/bash
if [ -n "$SUPERVISOR_START" ]
then
    if [ "$SUPERVISOR_START" -eq 1 ]
    then
        supervisord
        sleep 5
        tail -f /var/log/workers.log
    fi
fi


dumb-init node server.js
