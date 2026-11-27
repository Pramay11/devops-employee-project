
pipeline {
    agent any

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out Employee Management source code'
                checkout scm
            }
        }

        stage('Validate Docker Compose') {
            steps {
                echo 'Validating Docker Compose configuration'
                sh 'docker compose config --quiet'
            }
        }

        stage('Build Backend Image') {
            steps {
                echo 'Building Node.js backend Docker image'
                sh 'docker compose build backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo 'Building React frontend Docker image'
                sh 'docker compose build frontend'
            }
        }

        stage('Trivy Backend Scan') {
            steps {
                echo 'Scanning backend image for HIGH and CRITICAL vulnerabilities'
                sh '''
                    trivy image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    --ignore-unfixed \
                    devops-employee-project-backend:latest
                '''
            }
        }

        stage('Trivy Frontend Scan') {
            steps {
                echo 'Scanning frontend image for HIGH and CRITICAL vulnerabilities'
                sh '''
                    trivy image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    --ignore-unfixed \
                    devops-employee-project-frontend:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'CI pipeline and security scans completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the build and Trivy scan results.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
