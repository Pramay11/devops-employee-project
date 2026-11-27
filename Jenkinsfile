
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
    }

    post {
        success {
            echo 'CI pipeline completed successfully!'
        }

        failure {
            echo 'CI pipeline failed. Check the console output.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
