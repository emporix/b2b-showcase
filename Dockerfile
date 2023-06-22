FROM  node:16-alpine as builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build:prod

# Production image, copy all the files and run next
FROM node:16-alpine AS storefront
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD yarn start