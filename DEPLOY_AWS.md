# SoumyaFlow AWS Deployment Guide

This is the easiest beginner path I recommend for your current project:

1. publish first on **Amazon EC2**
2. put **Nginx** in front of the Node app
3. add a domain later with **Route 53**
4. add HTTPS after that

Your current project structure works well for this because the backend already serves the frontend when both folders are placed side by side on the same server.

## Recommended Folder Layout On The Server

```text
/var/www/soumyaflow/
|-- task-manager-frontend/
`-- task-manager-backend/
```

## Step 1: Create Your AWS Account Basics

Before launching anything:

1. sign in to AWS
2. create a billing alarm
3. use IAM users instead of daily root-account usage

AWS notes that billing alarms use the **US East (N. Virginia)** region for the billing metric. Source:
- [CloudWatch billing alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)

## Step 2: Launch An EC2 Instance

Use the EC2 console and launch:

- OS: Ubuntu LTS
- Instance type: a small Linux instance to start, for example `t3.micro` if available in your account/region
- Storage: 20 GB is usually enough for this starter app

Security group rules:

- allow `22` from **your IP only**
- allow `80` from `0.0.0.0/0`
- allow `443` from `0.0.0.0/0` later when you add HTTPS
- do **not** expose `3000` publicly if Nginx will proxy to it

AWS security group guidance:
- [EC2 security groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html)

## Step 3: Connect To The Server

Use EC2 Instance Connect from the AWS console, which AWS documents as a secure SSH option.

Source:
- [EC2 Instance Connect](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Connect-using-EC2-Instance-Connect.html)

## Step 4: Install Software On The EC2 Instance

Run these commands on Ubuntu:

```bash
sudo apt update
sudo apt install -y nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## Step 5: Upload Your Project

Copy both folders to the server so they stay separate:

```text
/var/www/soumyaflow/task-manager-frontend
/var/www/soumyaflow/task-manager-backend
```

You can upload using:

- Git clone
- SCP / WinSCP
- zip upload and extract

Create the target folder first:

```bash
sudo mkdir -p /var/www/soumyaflow
sudo chown -R ubuntu:ubuntu /var/www/soumyaflow
```

## Step 6: Test The App Manually

Go into the backend folder:

```bash
cd /var/www/soumyaflow/task-manager-backend
node server.js
```

Then open in the browser:

```text
http://EC2_PUBLIC_IP:3000
```

If it works, stop it with `Ctrl+C`.

## Step 7: Run It As A Background Service

A systemd service file is included here:

- `deploy/systemd/soumyaflow.service`

Copy it into place:

```bash
sudo cp deploy/systemd/soumyaflow.service /etc/systemd/system/soumyaflow.service
sudo systemctl daemon-reload
sudo systemctl enable soumyaflow
sudo systemctl start soumyaflow
sudo systemctl status soumyaflow
```

## Step 8: Put Nginx In Front

An Nginx config file is included here:

- `deploy/nginx/soumyaflow.conf`

Copy it into place:

```bash
sudo cp deploy/nginx/soumyaflow.conf /etc/nginx/sites-available/soumyaflow
sudo ln -s /etc/nginx/sites-available/soumyaflow /etc/nginx/sites-enabled/soumyaflow
sudo nginx -t
sudo systemctl restart nginx
```

Now open:

```text
http://EC2_PUBLIC_IP
```

## Step 9: Add A Domain Later

If you want a real domain:

1. register a domain in Route 53 or use an existing domain
2. create or use the hosted zone
3. point an `A` record to your public entry point

Route 53 notes:

- domain registration has an annual fee
- hosted zones also cost money
- AWS credits can’t be used for Route 53 domain registration

Sources:
- [Register a domain in Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html)
- [How domain registration works](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/welcome-domain-registration.html)

## Step 10: Add HTTPS

Important:

- AWS ACM public certificates are free when used with integrated AWS services like load balancers and CloudFront
- exportable ACM public certificates for direct use outside those integrated services are billed

That means for a cleaner AWS-native HTTPS setup, the next upgrade is usually:

- EC2 app behind an **Application Load Balancer**
- certificate from **ACM**
- DNS from **Route 53**

Sources:
- [ACM getting started](https://aws.amazon.com/certificate-manager/getting-started/)
- [Request a public certificate](https://docs.aws.amazon.com/acm/latest/userguide/acm-public-certificates.html)
- [ACM pricing](https://aws.amazon.com/certificate-manager/pricing/)

## Step 11: Email Notifications

If you want real email reminders later with Amazon SES:

1. verify your sender domain or email
2. if your account is in the SES sandbox, verify recipients too or request production access

Source:
- [SES verified identities](https://docs.aws.amazon.com/ses/latest/dg/verify-addresses-and-domains.html)

## Step 12: What To Check Before Public Launch

- change sample legal pages to lawyer-reviewed versions
- change sample employee/demo data
- move from JSON file storage to a real database
- add backups
- use stronger authentication
- restrict admin access carefully
- do not store sensitive HR data without access policy and retention rules

AWS reminds customers that security is a shared responsibility. AWS secures the cloud, and you secure your application, data, identities, and configuration.

Source:
- [AWS shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/)

## Why I’m Recommending EC2 First

As of **April 7, 2026**, AWS says App Runner will close to new customers on **April 30, 2026**, so I’m not choosing it as the first beginner path here.

Source:
- [App Runner availability change](https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html)

## Next Upgrade Path

After your first publish works, the best improvements are:

1. move data from `store.json` to PostgreSQL or DynamoDB
2. move file uploads to S3
3. add domain and HTTPS
4. add SES email
5. add CloudWatch logs and alerts
