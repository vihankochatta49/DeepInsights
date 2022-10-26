require('dotenv/config')
const request = require('request')
// Create an express app
const express = require('express')
const app = express()
// CONSTANTS
const ZOOM_GET_AUTHCODE='https://zoom.us/oauth/token?grant_type=authorization_code&code=';
const ZOOM_AUTH='https://zoom.us/oauth/authorize?response_type=code&client_id='
// CONSTANTS
const PORT=8000;
//Root URL /
//Root URL /
app.get('/', (req, res) => {
    /*
        If the code (auth code) property exists in req.query object,
        user is redirected from Zoom OAuth. If not, then redirect to Zoom for OAuth
    */
    const authCode=req.query.code;
    if (authCode) {
        // Request an access token using the auth code
        let url =  ZOOM_GET_AUTHCODE + authCode + '&redirect_uri=' + process.env.redirectURL;
        request.post(url, (error, response, body) => {
            // Parse response to JSON
            body = JSON.parse(body);
            console.log(body);
            const accessToken = body.access_token;
            const refreshToken = body.refresh_token;
            
            console.log(`Zoom OAuth Access Token: ${accessToken}`);
            console.log(`Zoom OAuth Refresh Token: ${refreshToken}`);
            if(accessToken)
        request.get('https://api.zoom.us/v2/users/me', (error, response, body) => {
            if (error) {
                console.log('API Response Error: ', error)
            } else {
                body = JSON.parse(body);
                var JSONResponse = '<pre><code>' + JSON.stringify(body, null, 2) + '</code></pre>'
                res.send(`
                    <style>
                        @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap');@import url('https://necolas.github.io/normalize.css/8.0.1/normalize.css');html {color: #232333;font-family: 'Open Sans', Helvetica, Arial, sans-serif;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}h2 {font-weight: 700;font-size: 24px;}h4 {font-weight: 600;font-size: 14px;}.container {margin: 24px auto;padding: 16px;max-width: 720px;}.info {display: flex;align-items: center;}.info>div>span, .info>div>p {font-weight: 400;font-size: 13px;color: #747487;line-height: 16px;}.info>div>span::before {content: "👋";}.info>div>h2 {padding: 8px 0 6px;margin: 0;}.info>div>p {padding: 0;margin: 0;}.info>img {background: #747487;height: 96px;width: 96px;border-radius: 31.68px;overflow: hidden;margin: 0 20px 0 0;}.response {margin: 32px 0;display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;}.response>a {text-decoration: none;color: #2D8CFF;font-size: 14px;}.response>pre {overflow-x: scroll;background: #f6f7f9;padding: 1.2em 1.4em;border-radius: 10.56px;width: 100%;box-sizing: border-box;}
                    </style>
                    <div class="container">
                        <div class="info">
                            <img src="${body.pic_url}" alt="User photo" />
                            <div>
                                <h2>${body.first_name} ${body.last_name}</h2>
                            </div>
                        </div>
                        <div class="response">
                            User API Response
                            ${JSONResponse}
                        </div>
                    </div>
                `);
            }
        }).auth(null, null, true, body.access_token);
    else
        res.send('Something went wrong')
        }).auth(process.env.clientID, process.env.clientSecret);
        return;
    }
    // If no auth code is obtained, redirect to Zoom OAuth to do authentication
    res.redirect(ZOOM_AUTH + process.env.clientID + '&redirect_uri=' + process.env.redirectURL)
})
//Kickstart express server on designated port
app.listen(8000, () => console.log(`Zoom OAuth NodeJS App started on port ${PORT}`))