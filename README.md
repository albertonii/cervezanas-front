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

## JEST + Supertest

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

# Distribution System API Endpoints

## Main url

https://distributionsystemapi-soyd-dev.fl0.io/

## GET

`Fetch data from country in GeoJSON format` /countries/${countryName} <br/>
`Fetch data from Autonomous Community in Spain in GeoJSON format` /communities/${countryName} <br/>
`Check if specific point [lat, lng] is inside Autonomous Community` /communities/${countryName}/inside?lat=[latitude]&lng=[longitude] <br/>

# TODO List

[ ] - Sistema de Distribución
[ ] - TODO 2
[ ] - TODO 3
