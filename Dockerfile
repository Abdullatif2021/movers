# Step 1: Build the app
FROM node:16 AS build-step

WORKDIR /app

# Copy package, lock files, and Yarn's configuration
COPY package.json yarn.lock .yarnrc.yml ./

# Copy .yarn directory with its content
COPY .yarn .yarn

# Install dependencies without cache checks for now
RUN yarn install --immutable

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Step 2: Serve the app with Nginx
FROM nginx:stable-alpine

# Copy the build output from the build step
COPY --from=build-step /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
