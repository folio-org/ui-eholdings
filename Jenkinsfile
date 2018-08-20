pipeline {
    agent {
        docker 'node:9'
    }
    stages {
        stage('Build') {
            steps {
                sh 'yar install'
            }
        }
        stage('Lint JS') {
            steps {
                sh 'yarn eslint --max-warnings=0'
            }
        }
    }
}