#!/bin/bash

DB_FILE="./temp/assessments.db"

if [ ! -f "$DB_FILE" ]; then
  mkdir -p "./temp"
  touch "$DB_FILE"
fi