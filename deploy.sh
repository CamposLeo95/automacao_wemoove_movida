#!/bin/bash
pm2 delete automacao.movida || true
git pull
npm install
npm run build
pm2 start npm --name automacao.movida -- run start