#!/bin/bash
pm2 delete automacao.movida || true
npm run build
pm2 start npm --name automacao.movida -- run start