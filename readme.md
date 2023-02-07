# Photodrop - client API
## API endpoints:
#
### [POST] auth/sign-in/send-otp - using for sign-in users
### body: JSON
{
	"phoneNumber": "992453199", // required - only numbers in string
	"countryCode": "380", // required - only numbers in string
}
#### After making request you will gain one time password (OTP) via phone number (you should use it for verification endpoint).
#
### [POST] /auth/sign-in/verify-otp
#### body: JSON
{
	"phoneNumber": "992453199", // required - only numbers in string
	"countryCode": "380", // required - only numbers in string
	"otp": "380980", // required - only numbers in string
}
#### After login you will gain access token, user information in response.body and refresh token in cookies. You should store access token in client side app in headers["authorization"].
#
### [POST] /auth/refresh
#### body: none
#### cookies: refreshToken - yourRefreshToken
#### After refreshing tokens you will gain new access token in response.body and new refresh token in cookies
#
### [GET] /auth/me
#### body: none
#### headers: ["authorization"]: access_token
- check access token expiration
#

