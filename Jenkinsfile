pipeline {
    agent { docker { image 'circleci/node:9' } }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Lint JS') {
            steps {
                sh 'npm run eslint --max-warnings=0'
            }
        }
    }
}