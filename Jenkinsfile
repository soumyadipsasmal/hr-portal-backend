pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t hr-portal-backend:latest .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker stop hr-portal-backend || true'
                sh 'docker rm hr-portal-backend || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d -p 5000:5000 --name hr-portal-backend hr-portal-backend:latest'
            }
        }
    }
}