# Cervezanas APP

Descripción de la aplicación

# About

Acerca de Cervezanas

## Motivation

Distribution System API surge por la necesidad de conocer cuales son los puntos de distribución a los cuales un distribuidor puede realizar un envío.

# Stack tecnológico

## NEXTJS

## What is Supabase?

[Supabase](https://supabase.com/) is, as they describe it, an open-source alternative to Firebase.

It is essentially a managed Postgres environment with additional functionalities such as auth, storage, and real-time capabilities.

### Good to know

A veces es necesario actualizar información interna de supabase. Por ejemplo, si quisieramos cambiar de la tabla interna auth.users la propiedad "access_level" o role del usuario para darle permisos de administrador. Podríamos lograrlo de la siguiente manera:

```bash
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{access_level}', '"admin"')
    WHERE raw_user_meta_data ->> 'email' = 'wawogar929@getmola.com';
```

## JEST + Supertest

### Test in local network

To test the app with different devices inside the same network we need to run the script inside package.json:

```bash
dev:local-network
```

This way we can have access to the application through the phone or another device going to linked host (192.168.1.137:5000)
This is useful for functionalities as QR scan code of products in event.

# Scripts

## pnpm run gen-link

This command will execute the following code:
"cloudflared tunnel --url http://localhost:3000"
creating a tunnel between Cloudfare and our application in localhost. We are going to use this functionality when testing TPV notification PUSH status, etc.
In the example above we need tunneling because the service is not deployed yet.

# Getting started

## Pre-requisites

We're going to use pnpm, so make sure it's installed in your system. Make sure to sign up for a Supabase account, as well.

## Step 1: Set up the project locally

Then, go into the directory of your clone, and copy .env.template to .env.

Go to Supabase, go into your project -> settings -> API. Copy and paste your keys into your newly created .env file.

Then, run:

```bash
pnpm install

pnpm run dev
```

---

# Production

## Optimize

To analyze the final bundle we can use tools to look for optimizations:

### Next Bundle Analyzer

Run the next script to analyze the bundle sizes of the packages created by the build command. We can visualize what can be removed.

```bash
    pnpm analyze
```

# Distribution System API Endpoints

## Main url

MIGRACIÓN:
https://distributionsystemapi-dev-tdzj.2.ie-1.fl0.io

NUEVO:
https://distributionsystemapi.onrender.com/

## GET

`Fetch data from country in GeoJSON format` /countries/${countryName} <br/>
`Fetch data from Autonomous Community in Spain in GeoJSON format` /communities/${countryName} <br/>
`Check if specific point [lat, lng] is inside Autonomous Community` /communities/${countryName}/inside?lat=[latitude]&lng=[longitude] <br/>

# TODO List

[ ] - Sistema de Distribución
[ ] - Optimizar bundle
[ ] - TODO 3
