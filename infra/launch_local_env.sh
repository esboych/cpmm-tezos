#!/bin/bash

# verbose & fail fast
set -ex 

#
# This script is for the local development setup
#
# It deploys locally:
# 1. A single-node Tezos network based on flextesa:latest Docker image
# 2. An FA1.2-compatible token
# 3. An FA2-compatible token
# 4. A contract to implement the business logic
#

# UPDATE THIS VALUES WITH YOURS OWN ONE: the Temple wallet address visible to local Flextesa node
WALLET_ADDRESS="tz1dor4MK3fX3UZbH6ecAJQRNdc1o7TQxKhS"

# fix root dir
ROOT_DIR="${PWD}/.."

# cleanup React env file
echo > ../web/.env

# clean previous state
docker rm -f my-sandbox

# run local flextesa node
docker run --rm --name my-sandbox --detach -p 20001:20000 -e block_time=3 -e flextesa_node_cors_origin='*' oxheadalpha/flextesa:latest hangzbox start
sleep 10

# send tz from bob to wallet
tezos-client transfer 100 from bob to ${WALLET_ADDRESS} --burn-cap 1

# deploy FA12 token
cd ${ROOT_DIR}/contracts/tokens/
tezos-client originate contract simpleFA1.2 transferring 100 from bob running codeFA12.tz --init '(Pair { Elt "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6"
            (Pair { Elt "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" 10 ;
                    Elt "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6" 10 }
                  1000) }
      1000)' --burn-cap 0.5 --force


# send FA12 tokens to wallet

# update React env with FA12 token address
TOKEN_ADDRESS=$(tezos-client list contracts | grep simpleFA1.2 | awk '{print $1}')
echo "REACT_APP_FA12_TOKEN_ADDRESS=${TOKEN_ADDRESS}" > ${ROOT_DIR}/web/.env

# deploy contract
cd ${ROOT_DIR}/contracts/core
ligo compile contract sender_back_fa12.ligo > code.tz
tezos-client originate contract sender_back_fa12 transferring 0 from bob running code.tz --init '1' --burn-cap 0.5 --force

# update React env with smart token address
CONTRACT_ADDRESS=$(tezos-client list contracts | grep sender_back_fa12 | awk '{print $1}')
echo "REACT_APP_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}" >> ${ROOT_DIR}/web/.env

# send FA12 tokens to contract
tezos-client from fa1.2 contract simpleFA1.2 transfer 200 from bob to sender_back_fa12 --burn-cap 1
