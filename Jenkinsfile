pipeline {
    agent {
        docker 'circleci/node:9'
    }
    stages {
        stage('Build') {
            steps {
                sh 'yarn install'
            }
        }
        stage('Lint JS') {
            steps {
                sh 'yarn eslint --max-warnings=0'
            }
        }
    }
}