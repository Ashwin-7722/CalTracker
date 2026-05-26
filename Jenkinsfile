pipeline {

    agent any

    environment {
        DOCKER_COMPOSE = 'docker compose'
    }

    stages {

        stage('Clone Repository') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                echo 'Installing Python dependencies...'
                sh 'pip install -r user-service/requirements.txt'
                sh 'pip install -r meal-service/requirements.txt'
                sh 'pip install -r calorie-service/requirements.txt'
                sh 'pip install -r api-gateway/requirements.txt'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building React frontend...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh "${DOCKER_COMPOSE} build"
            }
        }

        stage('Deploy Containers') {
            steps {
                echo 'Deploying containers...'
                sh "${DOCKER_COMPOSE} up -d"
            }
        }

        stage('Health Check') {
            steps {
                echo 'Running health checks...'
                sh 'sleep 10'
                sh 'curl -f http://localhost:8000/health || exit 1'
                sh 'curl -f http://localhost:8001/health || exit 1'
                sh 'curl -f http://localhost:8002/health || exit 1'
                sh 'curl -f http://localhost:8003/health || exit 1'
                echo 'All services are healthy!'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! All services deployed.'
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
            sh "${DOCKER_COMPOSE} logs"
        }
        always {
            echo 'Pipeline execution finished.'
        }
    }
}
