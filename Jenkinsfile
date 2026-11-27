
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

        stage('SonarQube Analysis') {
            steps {
                echo 'Analyzing source code using SonarQube'

                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube-Local') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
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

        stage('Push Images to Docker Hub') {
            steps {
                echo 'Logging in to Docker Hub and pushing images'

                withCredentials([
                    string(
                        credentialsId: 'dockerhub-token',
                        variable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x

                        echo "$DOCKERHUB_TOKEN" | docker login \
                            --username pramay11 \
                            --password-stdin

                        docker tag devops-employee-project-backend:latest \
                            pramay11/employee-backend:latest

                        docker tag devops-employee-project-frontend:latest \
                            pramay11/employee-frontend:latest

                        docker push pramay11/employee-backend:latest
                        docker push pramay11/employee-frontend:latest

                        docker logout
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'CI pipeline, SonarQube analysis, Trivy scans and Docker Hub push completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the build, security scan and Docker Hub logs.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
