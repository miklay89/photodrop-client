# Photodrop - client API
## API endpoints:
#
### [POST] auth/sign-in/send-otp - using for sign-in users
### body: JSON
{
	"phoneNumber": "992453199", // required - only numbers in string
	"countryCode": "380", // required - only numbers in string
}
- After making request you will gain one time password (OTP) via phone number (you should use it for verification endpoint).
#
### [POST] /auth/sign-in/verify-otp
#### body: JSON
{
	"phoneNumber": "992453199", // required - only numbers in string
	"countryCode": "380", // required - only numbers in string
	"otp": "380980", // required - only numbers in string
}
- After login you will gain access token, user information in response.body and refresh token in cookies. You should store access token in client side app in headers["authorization"].
#
### [POST] /auth/refresh
#### body: none
#### cookies: refreshToken - yourRefreshToken
- After refreshing tokens you will gain new access token in response.body and new refresh token in cookies
#
### [GET] /auth/me
#### body: none
#### headers: ["authorization"]: access_token
- you will gain user information in response.body
#
### [POST] /user/upload-selfie
#### body: MULTIPART FORM DATA
#### FIELDS: shiftX (integer, required), shiftY (integer, required), zoom (integer, required), width (integer, required), height (integer, required), files: file (Buffer, required)
#### headers: ["authorization"]: access_token
- uploads selfie to s3 + adds records in tables and return user info with selfie
#
### [POST] /user/update-name
#### body: JSON
{
	"fullName": "Mhari Isuzi", // required - only string
}
#### headers: ["authorization"]: access_token
- updates user full name and return updated user info with selfie
#
### [POST] /user/update-email
#### body: JSON
{
	"email": "mhari_isuzi@test.com", // required - only email
}
#### headers: ["authorization"]: access_token
- updates user email and return updated user info with selfie
#
### [GET] /dashboard/get-all
#### body: none
#### headers: ["authorization"]: access_token
- returns to user information of all of his albums + photos
#
### [GET] /dashboard/album/${albumId}
#### body: none
#### headers: ["authorization"]: access_token
- returns to user information of one album by album id
#
### [POST] /pay/album/create-payment/${albumId}
#### body: none
#### headers: ["authorization"]: access_token
- creates payment link for album
- after successful payment auto redirection to confirm endpoint ("${HOST_URL}/pay/album/confirm-payment/${albumId}") for storing payment data
#