#!/usr/bin/env bash

node workers/download_boe.js &
node workers/parse_boe.js &
node workers/download_item.js &
node workers/parse_item.js &
node workers/save_boe_item_to_mongodb.js &