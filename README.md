# Attandace App Admin Web Pannel
a simple web app built to interface with the api provided by attendace app back end https://github.com/suny-poly-cs-club/attendance-app-backend

before running make shure to adjust the url inside the .env file

## Run In development mode
```sh
pnpm install
pnpm dev
```

## Build for Production
```sh
pnpm install
pnpm Build
```
### TODO:
- page showing all club days you've checked in to
- live check in feed on QR page?
  - show people's names in a feed as they check in, with the QR code above it
- adjust how SSL certs are handled/generated
