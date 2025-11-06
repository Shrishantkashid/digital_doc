# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for the Digital Doctor application.

## Prerequisites

1. A MongoDB Atlas account (free tier available)
2. Basic understanding of database concepts

## Step-by-Step Setup

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and sign up for an account
3. Verify your email address

### 2. Create a New Cluster

1. After logging in, click "Build a Database"
2. Select the **Free** tier (M0 Sandbox)
3. Choose a cloud provider and region closest to you
4. Leave the cluster name as default or customize it
5. Click "Create Cluster"

### 3. Configure Database Access

1. In the left sidebar, click "Database Access" under "Security"
2. Click "Add New Database User"
3. Enter a username and password (remember these credentials)
4. Under "Built-in Role", select "Atlas Admin"
5. Click "Add User"

### 4. Configure Network Access

1. In the left sidebar, click "Network Access" under "Security"
2. Click "Add IP Address"
3. For development, you can select "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, add only your specific IP address
5. Click "Confirm"

### 5. Get Connection String

1. Go back to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string

### 6. Update Environment Variables

1. Open the [.env](.env) file in your project
2. Replace the `MONGODB_URI` value with your connection string
3. Replace `<username>` and `<password>` with the credentials you created in step 3
4. Make sure the database name is `digital_doctor`

Example:
```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.example.mongodb.net/digital_doctor?retryWrites=true&w=majority
```

### 7. Test the Connection

1. Run the application:
   ```
   npm run dev
   ```
2. The application should connect to your MongoDB Atlas cluster successfully

## Security Best Practices

1. Never commit your [.env](.env) file to version control
2. Use strong, unique passwords for database users
3. Limit network access to specific IP addresses in production
4. Regularly rotate your database credentials
5. Monitor your database usage and set up alerts

## Troubleshooting

### Connection Issues

1. **Invalid username/password**: Double-check your credentials in the connection string
2. **Network access denied**: Verify your IP address is in the Network Access list
3. **Timeout errors**: Check your firewall settings and internet connection

### Common Errors

1. **"Authentication failed"**: Ensure your username and password are correct
2. **"Host not found"**: Verify your cluster URL is correct
3. **"Database not found"**: Make sure you're using the correct database name (`digital_doctor`)

If you continue to experience issues, check the MongoDB Atlas documentation or support resources.