# Deployment Guide

## Prerequisites

- Node.js 18+
- MongoDB instance
- Domain name (for production)
- SSL certificate (Let's Encrypt recommended)

## Environment Variables

### Server (.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/badpeopleonline
JWT_SECRET=your-secure-secret-key-here
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Client
Create `.env.production` in client directory:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

1. **Install Docker and Docker Compose**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo apt-get install docker-compose
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/k2pitel/BadPeopleOnline.git
   cd BadPeopleOnline
   ```

3. **Set Environment Variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your values
   nano server/.env
   ```

4. **Build and Start**
   ```bash
   docker-compose up -d
   ```

5. **Access Application**
   - Client: http://localhost
   - Server: http://localhost:3001

### Option 2: Manual Deployment

#### Backend Deployment

1. **Setup Server**
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name badpeople-server
   pm2 startup
   pm2 save
   ```

#### Frontend Deployment

1. **Build Client**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Serve with Nginx**
   ```bash
   sudo apt-get install nginx
   sudo cp nginx.conf /etc/nginx/sites-available/badpeople
   sudo ln -s /etc/nginx/sites-available/badpeople /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 3: Cloud Platform Deployment

#### Heroku

1. **Backend**
   ```bash
   heroku create badpeople-api
   heroku addons:create mongolab
   heroku config:set JWT_SECRET=your-secret
   git subtree push --prefix server heroku main
   ```

2. **Frontend (Vercel)**
   ```bash
   cd client
   vercel --prod
   ```

#### Railway

1. **Install Railway CLI**
   ```bash
   npm install -g railway
   ```

2. **Deploy Backend**
   ```bash
   cd server
   railway login
   railway init
   railway up
   ```

3. **Deploy Frontend**
   ```bash
   cd client
   railway up
   ```

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings:
   - Server: Node.js, build command: `cd server && npm install`
   - Client: Node.js, build command: `cd client && npm run build`
3. Add MongoDB database
4. Set environment variables
5. Deploy

### Option 4: AWS Deployment

#### Using EC2

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.medium or larger
   - Configure security groups (ports 80, 443, 3001)

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm nginx
   ```

3. **Deploy Application**
   ```bash
   git clone https://github.com/k2pitel/BadPeopleOnline.git
   cd BadPeopleOnline
   npm run install:all
   ```

4. **Setup MongoDB**
   - Use MongoDB Atlas (recommended)
   - Or install locally:
   ```bash
   sudo apt install -y mongodb
   sudo systemctl enable mongodb
   ```

5. **Configure Nginx**
   ```bash
   sudo cp deployment/nginx.conf /etc/nginx/sites-available/badpeople
   sudo ln -s /etc/nginx/sites-available/badpeople /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Database Setup

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster (Free tier available)
3. Create database user
4. Whitelist IP addresses
5. Get connection string
6. Update MONGODB_URI in .env

### Local MongoDB

```bash
# Install MongoDB
sudo apt install mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Update .env
MONGODB_URI=mongodb://localhost:27017/badpeopleonline
```

## Seeding Initial Data

```bash
cd server
node src/utils/seedQuestions.js
```

## Monitoring and Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs badpeople-server
```

### Docker Logs
```bash
docker-compose logs -f server
docker-compose logs -f client
```

### Application Logs
Logs are written to:
- Server: `server/logs/`
- Client: Browser console

## Backup Strategy

### Database Backup
```bash
# Automated daily backup
mongodump --uri="$MONGODB_URI" --out=/backups/$(date +%Y%m%d)

# Cron job (daily at 2 AM)
0 2 * * * /usr/bin/mongodump --uri="$MONGODB_URI" --out=/backups/$(date +\%Y\%m\%d)
```

### Application Backup
```bash
# Backup entire application
tar -czf badpeople-backup-$(date +%Y%m%d).tar.gz BadPeopleOnline/
```

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Nginx or HAProxy
2. **Multiple Server Instances**: PM2 cluster mode
3. **Socket.io Clustering**: Redis adapter
4. **Session Storage**: Redis for shared sessions

### Vertical Scaling

1. Increase server resources (CPU, RAM)
2. Optimize database queries
3. Add database indexes
4. Enable caching

## Security Checklist

- [ ] Use HTTPS (SSL certificate)
- [ ] Set strong JWT_SECRET
- [ ] Enable firewall (UFW)
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up CORS properly
- [ ] Use secure headers (Helmet.js)
- [ ] Regular security audits
- [ ] Backup database regularly

## Troubleshooting

### Server won't start
- Check MongoDB connection
- Verify environment variables
- Check port availability: `lsof -i :3001`

### Client build fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version`

### WebSocket connection fails
- Check CORS settings
- Verify Socket.io URL
- Check firewall rules

### Database connection errors
- Verify MongoDB is running
- Check connection string
- Verify network access

## Maintenance

### Update Application
```bash
git pull origin main
cd server && npm install
cd ../client && npm install && npm run build
pm2 restart badpeople-server
sudo systemctl reload nginx
```

### Monitor Performance
- Use PM2 monitoring
- Setup application monitoring (DataDog, New Relic)
- Monitor database performance
- Track error rates

## Cost Estimation

### Small Scale (1K users)
- Server: $10-20/month (DigitalOcean, Railway)
- Database: Free (MongoDB Atlas)
- Domain: $12/year
- **Total**: ~$15-25/month

### Medium Scale (10K users)
- Server: $40-80/month
- Database: $30-50/month
- CDN: $20/month
- **Total**: ~$90-150/month

### Large Scale (100K users)
- Server: $200-400/month
- Database: $100-200/month
- CDN: $100/month
- Load Balancer: $50/month
- **Total**: ~$450-750/month
