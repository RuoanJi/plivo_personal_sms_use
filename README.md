# plivo_personal_sms_use
A nodejs simple web ui for lightweight plivo sms. Received SMS are persisted in human-readable JSON strings.

# Prerequisite
* Node.js >= 8.9.4
* npm >= 1.3.10

# Install
```
npm install
```

# Configure
Modify `settings.ini`

# Run
```
npm start
```

# Set up Plivo
1. Create an XML application in Plivo
2. Set message URL to `http://<your-domain|your-ip>:<port>/` using `POST`
3. Get a number from Plivo
4. Assign the XML application to your number

# Use
1. Receive SMS
http://<your-domain|your-ip>:<port>/plivo/view_sms/<your-plivo-number>
2. Send SMS
http://<your-domain|your-ip>:<port>/plivo/send_sms

# Future Plan
* Multiple datasource support
* Encryption and security
* Twilio support
