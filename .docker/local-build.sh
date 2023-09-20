#!/usr/bin/env bash
set -e

yarn clean
yarn build

rm -rf ./out
cp -r ./.next/standalone ./out
cp -r ./public ./out
cp -r ./.next/static ./out/.next/static
