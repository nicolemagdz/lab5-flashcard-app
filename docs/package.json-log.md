## Phase 3 package.json
{              
  "name": "flashcard-api",              
  "version": "1.0.0",               
  "description": "Express + Prisma backend for the Flashcard Study App",           
  "main": "src/server.js",             
  "scripts": {               
    "start": "node src/server.js",             
    "dev": "node --watch src/server.js",            
    "prisma:generate": "prisma generate",              
    "prisma:migrate": "prisma migrate dev"             
  },               
  "dependencies": {           
    "@prisma/client": "^5.20.0",               
    "express": "^4.19.2",                 
    "zod": "^3.23.8"                 
  },                 
  "devDependencies": {              
    "prisma": "^5.20.0"                
  }                 
}           

Phase 1 was kept because phase 3 is used for demo purposes and is not a production ready package.json.