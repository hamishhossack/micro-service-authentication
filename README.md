# Micro-service Authentication

A solution for oAuth2 authentication inside a micro service architecture.

The underlying architecture of Authentication allow us to secure both mobile, web and social apps through mutiple different streams. Some of these key technologies include:

* [OAuth2](http://oauth.net/2/): as an authenticaiton server
* [Passport](http://passportjs.org): for handing our authentication across platforms
* [Express](http://expressjs.com/): for our rest needs
* [Redis](http://redis.io/): for storage and communication
* [DynamoDB](https://aws.amazon.com/dynamodb/): secure private storage layer
 
**API Request Set**
> [Link to Postman Collections, including Auth Requests](https://www.getpostman.com/collections/31e76ebea0654d853c7d)

# Requirements

- Node v4.4.2 LTS

# Process Description
We use an access token based authentication which is common for OAuth2 and passport, this token is used inside a Bearer strategy.

First step is to ask for a token of which we have two types: Unknown(Anonymous), Known
- Unknown have restricted access and are usually granted to basic requests from our clients
- Known also have restricted access but it's based on their status or role

Using these token we are able to perform certain actions on each API (each of these will be specific to the API).
 
## Top level security
To get any token we need to provide secret information about origin (The Client), this could be mobile, web, cli or external. By [validating our clients credentials](https://github.com/padawangroup/authentication/blob/release/app/utils/strategies.js#L57) we ensure every request is safe.

## Gaining Access Tokens
For gaining **Unknown** access tokens which enables simple authentication we use the [client exchange in our OAuth Server](https://github.com/padawangroup/authentication/blob/release/app/auth/oauth.js#L70). 

For gaining **Known** access tokens which enables more advanced authentication we use the [username and password exchange in our OAuth Server](https://github.com/padawangroup/authentication/blob/release/app/auth/oauth.js#L70). 

## Using Access Tokens
To use the token we are given we use the `Authorization` header in our request. Since we are using the [Bearer Strategy](https://github.com/padawangroup/authentication/blob/release/app/utils/strategies.js#L86) to validate our token we we pass (as the `Authorization` value) 'Bearer OurGrantedToken' in the header.

Tokens last for 3 days before we need to refresh and authenticate again.

# Improvements
Once we move to pure javascript architecture we will choose to use a session base authentication or user saved token based system to allow for muti device and mutiple browser signons.

We can also improve our security by signing, registering and authenticating in a single place, HERE!

# Contributing
When adding to this repository please consider the current coding style and follow explicitly. We want to maintain a clean and friendly codebase, use comments and helpful marks for the next contributer.

# License

See [LICENSE](LICENSE.txt)
